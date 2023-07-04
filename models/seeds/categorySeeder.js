'use strict'

// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const db = require('config-file/mongoose')
const Category = require('models-file/category')
const SEED_CATEGORIES = require('models-file/json/categories.json').categories

// create categories seeder
const seedCategory = async (categories) => {
    try {
        await Promise.all(categories.map(async (category) => {
            return await Category.create({
                name: category.name,
                icon: category.icon
            })
        }))
        return console.log('category created.')
    } catch (error) {
        return console.log(error)
    }
}

// connect database
db.once('open', async () => {
    try {
        console.log('mongodb connected!')
        // create categories
        await seedCategory(SEED_CATEGORIES)
        db.close()
        return process.exit()
    } catch (error) {
        return console.log(error)
    }
})