'use strict'

// packages and variables
const express = require('express')
const router = express.Router()

const Record = require('../../models/record')
const Category = require('../../models/category')

// new get
router.get('/new', async (req, res, next) => {
    try {
        const today = new Date().toISOString().slice(0, 10).replaceAll('/', '-')
        const categories = await Category.find().lean()
        return res.render('new', {
            today,
            categories,
            javascripts: ['new.js']
        })
    } catch (error) {
        return next(error)
    }
})

// new post
router.post('/new', async (req, res, next) => {
    try {
        const userId = req.user._id
        const { type, name, date, categoryId, amount } = req.body

        await Record.create({
            type,
            name,
            date,
            categoryId,
            amount,
            userId
        })
        req.flash('success_msg', 'Create success!!!')
        return res.redirect('/')
    } catch (error) {
        return next(error)
    }
})

// edit get
router.get('/edit/:id', async (req, res, next) => {
    try {
        const _id = req.params.id
        const userId = req.user._id

        const record = await Record.findOne({ _id, userId }).lean()
        record.date = new Date(record.date).toISOString().slice(0, 10)

        const categories = await Category.find().lean()
        const category = categories.find((category) => {
            if (category._id.toString() === record.categoryId.toString()) {
                return category
            }
        })

        return res.render('edit', {
            _id,
            record,
            categories,
            category: category.name,
            javascripts: ['edit.js']
        })
    } catch (error) {
        return next(error)
    }
})

// edit put
router.put('/edit/:id', async (req, res, next) => {
    try {
        const _id = req.params.id
        const userId = req.user._id
        await Record.findOneAndUpdate({ _id, userId }, req.body)
        req.flash('success_msg', 'Modify success!!!')
        return res.redirect('/')
    } catch (error) {
        return next(error)
    }
})

// delete
router.delete('/delete/:id', async (req, res, next) => {
    try {
        const _id = req.params.id
        const userId = req.user._id
        await Record.findOneAndDelete({ _id, userId })
        req.flash('success_msg', 'Delete success!!!')
        return res.redirect('/')
    } catch (error) {
        return next(error)
    }
})

module.exports = router