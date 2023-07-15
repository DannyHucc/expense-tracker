'use strict'

const express = require('express')
const router = express.Router()
const Category = require('models-file/category')
const Record = require('models-file/record')

router.get('/', async (req, res, next) => {
    try {
        // get website data and set variable
        const userId = req.user._id
        let income = 0
        let expense = 0

        // get database data
        const recordsData = await Record.find({ userId }).lean()
        const categories = await Category.find().lean()

        // formate record data
        const records = await Promise.all(recordsData.map(async (record) => {
            if (record.type === 'income') income += record.amount
            if (record.type === 'expense') expense += record.amount

            record.amount = new Intl.NumberFormat('en-US').format(record.amount)
            record.date = new Date(record.date).toISOString().slice(0, 10)

            const icon = categories.find((category) =>
                category._id.toString() === record.categoryId.toString()).icon
            const formattedRecord = { ...record, icon }
            return formattedRecord
        }))

        // calculate amount
        let totalAmount = income - expense
        const totalAmountColor = totalAmount >= 0 ? "success" : "danger"
        income = new Intl.NumberFormat('en-US').format(income)
        expense = new Intl.NumberFormat('en-US').format(expense)
        totalAmount = new Intl.NumberFormat('en-US').format(totalAmount)

        // render page
        return res.render('index', {
            categories,
            records,
            income,
            expense,
            totalAmount,
            totalAmountColor,
            home: 'home',
            javascripts: ['index.js']
        })
    } catch (error) {
        return next(error)
    }
})

router.get('/filter', async (req, res, next) => {
    try {
        // get website data and set variable
        const { sortCategory, sortMethod, sortTitle } = req.query
        const userId = req.user._id
        let income = 0
        let expense = 0
        const sort = {}
        sort[sortTitle] = sortMethod

        // get database data
        const categories = await Category.find().lean()
        const recordsData = sortCategory
            ? await Record.find({ userId, categoryId: sortCategory }).sort(sort).lean()
            : await Record.find({ userId }).sort(sort).lean()

        // formate record data
        const records = await Promise.all(recordsData.map((record) => {
            if (record.type === 'income') income += record.amount
            if (record.type === 'expense') expense += record.amount

            record.amount = new Intl.NumberFormat('en-US').format(record.amount)
            record.date = new Date(record.date).toISOString().slice(0, 10)

            const icon = categories.find((category) =>
                category._id.toString() === record.categoryId.toString()).icon
            const formattedRecord = { ...record, icon }
            return formattedRecord
        }))

        // calculate amount
        let totalAmount = income - expense
        const totalAmountColor = totalAmount >= 0 ? "success" : "danger"
        income = new Intl.NumberFormat('en-US').format(income)
        expense = new Intl.NumberFormat('en-US').format(expense)
        totalAmount = new Intl.NumberFormat('en-US').format(totalAmount)

        // render page
        return res.render('index', {
            categories,
            records,
            income,
            expense,
            totalAmount,
            totalAmountColor,
            sortCategory: sortCategory
                ? categories.find((category) =>
                    category._id.toString() === sortCategory).name
                : "",
            sortMethod,
            sortTitle,
            home: 'home',
            javascripts: ['index.js']
        })
    } catch (error) {
        return next(error)
    }
})

module.exports = router