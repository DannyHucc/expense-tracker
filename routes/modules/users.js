'use strict'

// packages and variables
const express = require('express')
const router = express.Router()
const passport = require('passport')

// login
router.get('/login', async (req, res, next) => {
    try {
        res.render('users/login')
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
        res.render('users/register')
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