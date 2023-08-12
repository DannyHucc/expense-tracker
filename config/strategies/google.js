'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// packages and variables
const bcrypt = require('bcryptjs')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../../models/user')

// callback function for third party login strategy
async function thirdPartyOAuth(accessToken, refreshToken, profile, done) {
    try {
        const { name, email } = profile._json
        let user = await User.findOne({ email })
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(randomPassword, salt, null)

        user = await User.create({
            name,
            email,
            password: hash
        })
        return done(null, user)
    } catch (error) {
        done(error, false)
    }
}

module.exports = passport => {
    // Google Strategy
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK
        },
        thirdPartyOAuth
    ))
}