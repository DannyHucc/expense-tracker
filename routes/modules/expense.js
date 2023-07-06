'use strict'

// packages and variables
const express = require('express')
const router = express.Router()
const Record = require('models-file/record')
const Category = require('models-file/category')

// new get
router.get('/new', async (req, res, next) => {
    try {
        const today = new Date().toISOString().slice(0, 10).replaceAll('/', '-')
        const categories = await Category.find().lean()
        return res.render('new', {
            today,
            categories,
            new: 'new',
            javascript: ['new.js']
        })
    } catch (error) {
        next(error)
    }
})

// new post
router.post('/new', async (req, res, next) => {
    try {
        const userId = req.user._id
        const { type, name, date, categoryId, amount } = req.body

        let categories = await Category.find().lean()
        categories = categories.map(async (category) => {
            category._id = category._id.toString()
            return category
        })

        await Record.create({
            type,
            name,
            date,
            categoryId,
            amount,
            userId,
            new: 'new',
            javascript: ['new.js']
        })
        return res.redirect('/')
    } catch (error) {
        next(error)
    }
})

module.exports = router