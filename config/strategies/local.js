'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// packages and variables
const bcrypt = require('bcryptjs')
const LocalStrategy = require('passport-local').Strategy
const User = require('../../models/user')

module.exports = passport => {
    // Local Strategy
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // pass request to verify function
        },
        async (req, email, password, done) => { // pass request for parameter
            try {
                // mail not find
                const user = await User.findOne({ email })
                if (!user) {
                    return done(null, false, req.flash('warning_msg', 'That email is not registered!'))
                }
                // password incorrect
                const isMatch = await bcrypt.compareSync(password, user.password)
                if (!isMatch) {
                    return done(null, false, req.flash('warning_msg', 'Incorrect email or password!'))
                }
                // user and password correct.
                return done(null, user)
            } catch (error) {
                return done(error, false)
            }
        }
    ))
}