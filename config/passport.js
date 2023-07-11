'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GithubStrategy = require("passport-github2").Strategy
const User = require('models-file/user')

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

module.exports = app => {
    // Middleware
    app.use(passport.initialize())
    app.use(passport.session())

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

    // Google Strategy
    passport.use(new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK
        },
        thirdPartyOAuth
    ))

    // Github Strategy
    passport.use(new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK,
        },
        githubOAuth
    ))

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
}