'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const express = require('express')
const exphbs = require('express-handlebars')
const hbshelpers = require('handlebars-helpers')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const routes = require('routes-file')
const app = express()
const helpers = hbshelpers()
const PORT = process.env.PORT || 8080
require('config-file/mongoose')

// template engine: express-handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: helpers
}))
app.set('view engine', 'hbs')

// middleware: express-static, body-parser, method-override
// app.use(express.static('public'))
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// middleware: routes
app.use(routes)

// start the server
app.listen(PORT, () => {
    console.log(`Express is listening on localhost:${PORT}`)
})