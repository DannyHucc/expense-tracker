'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// packages and variables
const bcrypt = require('bcryptjs')
const GithubStrategy = require("passport-github2").Strategy
const User = require('../../models/user')

// callback function for github login strategy
async function githubOAuth(accessToken, refreshToken, profile, done) {
    try {
        const { login, id } = profile._json
        let user = await User.findOne({ email: id })
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(randomPassword, salt, null)

        user = await User.create({
            name: login,
            email: id,
            password: hash
        })
        return done(null, user)
    } catch (error) {
        done(error, false)
    }
}

module.exports = passport => {
    // Github Strategy
    passport.use(new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK,
        },
        githubOAuth
    ))
}