'use strict'

// packages and variables
const express = require('express')
const router = express.Router()
const { authenticator } = require('middleware-file/auth')

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

module.exports = router