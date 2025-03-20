const mongoose = require('mongoose')

const driverSchema = new mongoose.Schema({
    name: String,
    image: String,
    phoneNumber: String,
    experience: Number,
    gender:String,
    bus: {type: mongoose.Schema.Types.ObjectId, ref: "Bus"},
}, {timestamps: true})

const driverModel = mongoose.model("Driver", driverSchema)
module.exports = driverModel