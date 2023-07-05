'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('models-file/user')

module.exports = app => {
    // Middleware
    app.use(passport.initialize())
    app.use(passport.session())

    // Local Strategy
    passport.use(new LocalStrategy({ usernameField: 'email' },
        async (email, password, done) => {
            try {
                // mail not find
                const user = await User.findOne({ email })
                if (!user) {
                    return done(null, false, { message: 'That email is not registered!' })
                }
                // password incorrect
                const isMatch = await bcrypt.compareSync(password, user.password)
                if (!isMatch) {
                    return done(null, false, { message: 'Email or password incorrect.' })
                }
                // user and password correct.
                return done(null, user)
            } catch (error) {
                return done(error, false)
            }
        }
    ))

    // Session
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
}