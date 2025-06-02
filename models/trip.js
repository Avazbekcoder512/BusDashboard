const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    departure_date: String,
    departure_time: String,
    arrival_date: String,
    arrival_time: String,
    vip_price: Number,
    premium_price: Number,
    ekonom_price: Number,
    seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
}, { timestamps: true })

const tripModel = mongoose.model('Trip', tripSchema)
module.exports = tripModel