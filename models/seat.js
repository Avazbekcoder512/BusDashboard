const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    seatNumber: Number,
    departure_date: String,
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    status: { type: String, enum: ["empty", "busy"], default: "empty" },
    booked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    price: Number
}, { timestamps: true })

const seatModel = mongoose.model("Seat", seatSchema)
module.exports = seatModel