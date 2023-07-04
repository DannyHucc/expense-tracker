'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const mongoose = require('mongoose')

// create schema 
const Schema = mongoose.Schema
const categorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Category', categorySchema)