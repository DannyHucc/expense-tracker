'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// packages and variables
const passport = require('passport')

const LocalStrategy = require('./strategies/local')
const FacebookStrategy = require('./strategies/facebook')
const GoogleStrategy = require('./strategies/google')
const GithubStrategy = require("./strategies/github")

const User = require('../models/user')

// Strategies
LocalStrategy(passport)
FacebookStrategy(passport)
GoogleStrategy(passport)
GithubStrategy(passport)

// serialize and deserialize
passport.serializeUser(async (user, done) => {
    try {
        return done(null, user.id)
    } catch (error) {
        return done(error, null)
    }
})
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).lean()
        return done(null, user)
    } catch (error) {
        return done(error, null)
    }
})

module.exports = passport