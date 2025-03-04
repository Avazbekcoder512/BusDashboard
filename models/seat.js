const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    seetNumber: Number,
    bus: {type: mongoose.Schema.Types.ObjectId, ref: "Bus"},
    status: {type: String, enum: ["empty", "booked"], default: "empty"}
}, {timestamps: true})

const seatModel = mongoose.model("Seat", seatSchema)
module.exports = seatModel