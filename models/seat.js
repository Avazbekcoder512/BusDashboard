const mongoose = require('mongoose')

const seatSchema = new mongoose.Schema({
    seetNumber: Number,
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    status: { type: String, enum: ["bo'sh", "band"], default: "bo'sh" },
    booked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    price: Number
}, { timestamps: true })

const seatModel = mongoose.model("Seat", seatSchema)
module.exports = seatModel