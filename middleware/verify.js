'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const LocalStorage = require('node-localstorage').LocalStorage
const localStorage = new LocalStorage('./scratch')

module.exports = {
    jwtVerify: async (req, res, next) => {
        try {
            const errors = []
            const token = JSON.parse(localStorage.getItem('JWTToken'))

            // verify jwt token
            const decoded = jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
                if (!decoded) {
                    errors.push({ message: 'Reset password time expires! Please resend the reset password letter.' })
                    return null
                }
                return decoded
            })

            // get user data form database
            if (decoded) {
                const user = await User.findOne({
                    _id: decoded.id,
                    'tokens.token': token
                })
                if (!user) {
                    errors.push({ message: 'User not find. Please to check your email.' })
                }
                req.email = user.email
            }

            if (errors.length) {
                return res.render('reset/passwordReset', { errors })
            }

            return next()
        } catch (error) {
            return next(error)
        }
    }
}