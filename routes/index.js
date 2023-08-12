'use strict'

// packages and variables
const express = require('express')
const router = express.Router()

const { authenticator } = require('../middleware/auth')

// router
const home = require('./modules/home')
const user = require('./modules/users')
const expense = require('./modules/expense')
const auth = require('./modules/auth')
const reset = require('./modules/reset')

// middleware: routes
router.use('/auth', auth)
router.use('/users', user)
router.use('/reset', reset)
router.use('/expense', authenticator, expense)
router.use('/', authenticator, home)

router.use((error, req, res, next) => {
    if (error.status === 404) {
        req.flash('warning_msg', 'The requested URL was not found on this server.')
        return res.status(404).render('error')
    }
    if (error.status === 500) {
        req.flash('warning_msg', 'Sorry! Server is broken. We will fix it soon.')
        return res.status(500).render('error')
    }
    next(error)
})

module.exports = router