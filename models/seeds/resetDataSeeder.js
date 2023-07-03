// environment
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// packages and variables
const db = require("../../config/mongoose")
const Category = require("../category")
const User = require("../user")
const Record = require("../record")

db.once("open", async () => {
    try {
        await Category.deleteMany({})
        await Record.deleteMany({})
        await User.deleteMany({})
        console.log("All data has removed.")
        db.close()
        return process.exit()
    } catch (error) {
        return console.log(error)
    }
})