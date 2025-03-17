const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    routes: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    bus_id: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    departure_date: String,
    departure_time: String,
    arrival_date: String,
    arrival_time: String,
    ticket_price: Number,
}, { timestamps: true })

const tripModel = mongoose.model('Trip', tripSchema)
module.exports = tripModel