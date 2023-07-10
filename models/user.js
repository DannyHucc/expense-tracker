'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const mongoose = require('mongoose')

// create schema
const Schema = mongoose.Schema
const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }],
    },
    { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)