'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

const User = require('../../models/user')
const { jwtVerify } = require('../../middleware/verify')

const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')

// password reset get
router.get('/passwordReset', async (req, res, next) => {
    try {
        return res.render('reset/passwordReset')
    } catch (error) {
        return next(error)
    }
})

// password reset post
router.post('/passwordReset', async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            req.flash('warning_msg', 'Email not register')
            return res.render('reset/passwordReset')
        }

        // check reset time
        const resetInterval = Number(new Date() - Number(user.updatedAt))
        const waitingTime = (10 * 60 * 1000 - resetInterval) / 60000
        if (waitingTime > 0) {
            req.flash('warning_msg', `The password reset interval is too short, please try again after ${Math.floor(waitingTime)} minute`)
            return res.redirect('/reset/passwordReset')
        }

        // create token and store in local storage
        const payload = { id: user._id, email }
        const EXPIRES_IN = 10 * 60 * 1000 // 10 minute
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: EXPIRES_IN }
        )
        localStorage.setItem('JWTToken', JSON.stringify(token))

        // store token in database
        user.tokens = await user.tokens.concat({ token })
        await user.save()

        // create mail method
        const LOCAL_URL = process.env.LOCAL_URL
        const transporter = await nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // for port 465
            auth: {
                user: process.env.GOOGLE_SMTP_MAIL,
                pass: process.env.GOOGLE_SMTP_PASSWORD,
            }
        })

        // send email
        const info = await transporter.sendMail({
            from: process.env.GOOGLE_SMTP_MAIL,
            to: email,
            subject: 'expense-tracker password reset ✔',
            html: `<a href=${LOCAL_URL}/reset/resetPassword>Please reset password in 30 mins.</a>`,
        })

        // redirect to router /reset/confirmMail
        return res.redirect('/reset/confirmMail')
    } catch (error) {
        return next(error)
    }
})

// reset password get
router.get('/resetPassword', jwtVerify, async (req, res, next) => {
    try {
        return res.render('reset/resetPassword')
    } catch (error) {
        return next(error)
    }
})

// reset password post
router.post('/resetPassword', jwtVerify, async (req, res, next) => {
    try {
        const { email } = req
        const { password, confirmPassword } = req.body
        const token = JSON.parse(localStorage.getItem('JWTToken'))
        const user = await User.findOne({ email: email, 'tokens.token': token })

        const errors = []
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_+-={}\[\]\\:;"'<>?,.\/])[A-Za-z\d~!@#$%^&*()_+-={}\[\]\\:;"'<>?,.\/]{8,20}$/

        // check reset password info is valid
        if (!passwordRegex.test(password)) {
            errors.push({ message: 'The password must be 8-20 characters long, contain letters and numbers and symbols.' })
        }
        if (password !== confirmPassword) {
            errors.push({ message: 'The password confirmation dose not match.' })
        }
        if (errors.length) {
            return res.render('reset/resetPassword', {
                errors,
                password,
                confirmPassword
            })
        }

        // reset user password and updateAt
        const salt = await bcrypt.genSaltSync(10)
        const hash = await bcrypt.hashSync(password, salt, null)
        user.tokens = []
        user.password = hash
        user.updateAt = new Date()
        await user.save()
        // remove token
        localStorage.removeItem('JWTToken')

        // redirect to router /users/login
        req.flash('success_msg', `The password reset success!`)
        return res.redirect('/users/login')
    } catch (error) {
        return next(error)
    }
})

// reset confirm mail get
router.get('/confirmMail', async (req, res, next) => {
    try {
        return res.render('reset/confirmMail')
    } catch (error) {
        return next(error)
    }
})

module.exports = router