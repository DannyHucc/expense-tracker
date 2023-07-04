'use strict'

const express = require('express')
const router = express.Router()

router.get('/', async (req, res, next) => {
    try {
        res.render('index')
    } catch (error) {
        return next(error)
    }
})

module.exports = router