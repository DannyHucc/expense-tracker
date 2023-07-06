'use strict'

// packages and variables
const express = require('express')
const router = express.Router()
const { authenticator } = require('middleware-file/auth')

// router
const home = require('./modules/home')
const user = require('./modules/users')
const expense = require('./modules/expense')

// middleware: routes
router.use('/expense', authenticator, expense)
router.use('/users', user)
router.use('/', authenticator, home)

module.exports = router