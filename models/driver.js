const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    name: String,
    image: String,
    phoneNumber: String,
    experience: Number,
    bus_id: {type: mongoose.Schema.Types.ObjectId, ref: "Bus"},
    role: {type: String, default: "driver"}
}, {timestamps: true})

const driverModel = mongoose.model("Driver", driverSchema)
module.exports = driverModel