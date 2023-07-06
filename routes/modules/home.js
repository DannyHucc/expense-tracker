'use strict'

const express = require('express')
const router = express.Router()
const Category = require('models-file/category')
const Record = require('models-file/record')

router.get('/', async (req, res, next) => {
    try {
        const userId = req.user._id
        let income = 0
        let expense = 0

        const recordsData = await Record.find({ userId }).lean()
        const categories = await Category.find().lean()

        const records = await Promise.all(recordsData.map(async (record) => {
            if (record.type === 'income') income += record.amount
            if (record.type === 'expense') expense += record.amount
            record.date = new Date(record.date).toISOString().slice(0, 10)
            const icon = categories.find((category) =>
                category._id.toString() === record.categoryId.toString()).icon
            const formattedRecord = { ...record, icon }
            return formattedRecord
        }))

        let totalAmount = income - expense
        const totalAmountColor = totalAmount >= 0 ? "success" : "danger"

        income = new Intl.NumberFormat('en-US').format(income)
        expense = new Intl.NumberFormat('en-US').format(expense)
        totalAmount = new Intl.NumberFormat('en-US').format(totalAmount)

        return res.render('index', {
            categories,
            records,
            income,
            expense,
            totalAmount,
            totalAmountColor
        })
    } catch (error) {
        return next(error)
    }
})

module.exports = router