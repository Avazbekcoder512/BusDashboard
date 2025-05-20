const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String
}, { timestamps: true })

const stationModel = mongoose.model("City", stationSchema)
module.exports = stationModel