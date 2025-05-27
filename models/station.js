const mongoose = require('mongoose')

const stationSchema = new mongoose.Schema({
    name: String,
}, { timestamps: true })

const stationModel = mongoose.model("City", stationSchema)
module.exports = stationModel