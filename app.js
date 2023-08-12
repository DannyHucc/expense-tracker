'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

// packages and variables
const express = require('express')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const path = require('path')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const flash = require('connect-flash')
const routes = require('./routes')
const app = express()
const helpers = hbshelpers()
const PORT = process.env.PORT || 8080
require('./config/mongoose')

// include redis and set redis config
const Redis = require("ioredis")
const connectRedis = require('connect-redis')
const redisClient = new Redis({
    family: "IPv6",
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
})

const RedisStore = connectRedis(session)
redisClient.on('error', function (err) {
    console.log(`Could not connect to redis, error message: ${err}`)
})
redisClient.on('connect', function (err) {
    console.log('Connect to redis successfully')
})

// template engine: express-handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: helpers
}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

// middleware: express-static, body-parser, method-override
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// middleware: session
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: true, // don't create session until something stored
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}))

// middleware: passport initialize
app.use(passport.initialize())
app.use(passport.session())

// middleware: flash and set local variable
app.use(flash())
app.use(async (req, res, next) => {
    try {
        res.locals.isAuthenticated = req.isAuthenticated()
        res.locals.user = req.user
        res.locals.success_msg = req.flash('success_msg')
        res.locals.warning_msg = req.flash('warning_msg')
        return next()
    } catch (error) {
        next(error)
    }
})

// middleware: routes
app.use(routes)

// start the server
app.listen(PORT, () => {
    console.log(`Express is listening on localhost:${PORT}`)
})