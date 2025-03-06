const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    name: String,
    image: String,
    username: String,
    password: String,
    phoneNumber: String,
    experience: Number,
    assignedBus: {type: mongoose.Schema.Types.ObjectId, ref: "Bus"},
    role: {type: String, default: "driver"}
}, {timestamps: true})

const driverModel = mongoose.model("Driver", driverSchema)
module.exports = driverModel