'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const mongoose = require('mongoose')

// create schema
const Schema = mongoose.Schema
const recordSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectID,
        ref: 'User',
        index: true,
        required: true
    },
    categoryId: {
        type: Schema.Types.ObjectID,
        ref: 'Category',
        index: true,
        required: true
    }
})

module.exports = mongoose.model('Record', recordSchema)