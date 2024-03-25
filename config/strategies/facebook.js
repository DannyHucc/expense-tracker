'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// packages and variables
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy
const User = require('../../models/user')

// callback function for third party login strategy
async function thirdPartyOAuth(accessToken, refreshToken, profile, done) {
    try {
        const { name, id } = profile._json
        let user = await User.findOne({ fb_id: id })
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(randomPassword, salt, null)

        user = await User.create({
            name,
            email: id,
            fb_id: id,
            password: hash
        })
        return done(null, user)
    } catch (error) {
        done(error, false)
    }
}

module.exports = passport => {
    // Facebook Strategy
    passport.use(new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK,
            profileFields: ['email', 'displayName']
        },
        thirdPartyOAuth
    ))
}