'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const bcrypt = require('bcryptjs')
const db = require('config-file/mongoose')
const User = require('models-file/user')
const Record = require('models-file/record')
const Category = require('models-file/category')
const SEED_USERS = require('models-file/json/users.json').users
const SEED_RECORD = require('models-file/json/records.json').records

// create user seeder
const seedUser = async (user) => {
    try {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)
        return await User.create({
            name: user.name,
            email: user.email,
            password: hash
        })
    } catch (error) {
        return console.log(error)
    }
}

// create record seeder
const seedRecord = async (SEED_RECORD, user) => {
    try {
        const userId = user._id
        return await Promise.all(SEED_RECORD.map(async (RECORD) => {
            const findCategory = await Category.findOne({ name: RECORD.category }).lean()
            const categoryId = findCategory._id
            const recordData = await Object.assign(
                {},
                RECORD, {
                userId,
                categoryId
            })
            return await Record.create(recordData)
        }))
    } catch (error) {
        return console.log(error)
    }
}

// connect database and create seed
db.once('open', async () => {
    try {
        await Promise.all(SEED_USERS.map(async (USER) => {
            // create user seed
            const user = await seedUser(USER)
            // create record seed
            return await seedRecord(SEED_RECORD, user)
        }))
        console.log('All users and records are created.')
        db.close()
        return process.exit()
    } catch (error) {
        return console.log(error)
    }
})