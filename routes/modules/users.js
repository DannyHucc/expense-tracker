'use strict'

// packages and variables
const express = require('express')
const router = express.Router()

// login
router.get('/login', async (req, res, next) => {
    try {
        res.render('users/login')
    } catch (error) {
        return next(error)
    }
})

// register
router.get('/register', async (req, res, next) => {
    try {
        res.render('users/register')
    } catch (error) {
        return next(error)
    }
})

module.exports = router