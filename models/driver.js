const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    phoneNumber: String,
    experience: Number,
    gender:String,
    bus: {type: mongoose.Schema.Types.ObjectId, ref: "Bus"},
    image: String
}, {timestamps: true})

const driverModel = mongoose.model("Driver", driverSchema)
module.exports = driverModel