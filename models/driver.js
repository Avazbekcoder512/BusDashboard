const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    name: String,
    image: String,
    email: String,
    password: String,
    phoneNumber: String,
    experience: Number,
    assignedBus: {type: mongoose.Schema.Types.ObjectId, ref: "Bus"}
}, {timestamps: true})

const driverModel = mongoose.model("Driver", driverSchema)
module.exports = driverModel