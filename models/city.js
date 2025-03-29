const mongoose = require('mongoose')

const citySchema = new mongoose.Schema({
    name: String
}, { timestamps: true })

const cityModel = mongoose.model("City", citySchema)
module.exports = cityModel