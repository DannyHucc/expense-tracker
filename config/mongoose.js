// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const mongoose = require('mongoose')

// set connect
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// get connect
const db = mongoose.connection

// connecting error
db.on('error', () => {
    console.log('mongodb error!')
})

// connecting success
db.once('open', () => {
    console.log('mongodb connected!')
})

module.exports = db