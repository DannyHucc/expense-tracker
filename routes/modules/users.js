'use strict'

// packages and variables
const express = require('express')
const router = express.Router()
const passport = require('passport')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const User = require('models-file/user')

// login
router.get('/login', async (req, res, next) => {
    try {
        return res.render('users/login')
    } catch (error) {
        return next(error)
    }
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

// register
router.get('/register', async (req, res, next) => {
    try {
        return res.render('users/register')
    } catch (error) {
        return next(error)
    }
})

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body
        const isUserExisted = await User.exists({ email })
        const errors = []
        const passwordRegex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()_+-={}\[\]\\:;"'<>?,.\/])[A-Za-z\d~!@#$%^&*()_+-={}\[\]\\:;"'<>?,.\/]{8,20}$/

        // check if the register info is valid
        if (isUserExisted) {
            errors.push({ message: 'User already exists!' })
        }

        if (!validator.isEmail(email)) {
            errors.push({ message: 'Email address is invalid.' })
        }

        if (!passwordRegex.test(password)) {
            errors.push({ message: 'The password must be 8-20 characters long, contain letters and numbers and symbols.' })
        }

        if (password !== confirmPassword) {
            errors.push({ message: 'The password confirmation dose not match.' })
        }

        if (errors.length) {
            return res.render('users/register', { errors, name, email, password, confirmPassword })
        }

        // create the user register information
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt, null)
        const userName = email.slice(0, Number(email.indexOf("@")))
        await User.create({ name: userName, email, password: hash })
        req.flash('success_msg', 'Register successfully! Please login to your account.')
        return res.redirect('/users/login')
    } catch (error) {
        return next(error)
    }
})

// logout
router.get('/logout', async (req, res, next) => {
    try {
        req.logout()
        req.flash("success_msg", "Logout success.")
        return res.redirect('/users/login')
    } catch (error) {
        return next(error)
    }
})

module.exports = router