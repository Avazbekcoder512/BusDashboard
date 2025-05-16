const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
    ticketId: String,
    passenger_Id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    passenger: String,
    gender: String,
    passport: String,
    phoneNumber: String,
    seat_number: Number,
    seat: { type: mongoose.Schema.Types.ObjectId, ref: "Seat" },
    bus_number: String,
    from: String,
    to: String,
    departure_date: String,
    departure_time: String,
    price: Number,
    status: { type: String, enum: ["booked", "canceled"], default: "booked" },
    condition_status: { type: String, enum: ['arrived'] }
}, { timestamps: true })

const ticketModel = mongoose.model("Ticket", ticketSchema)
module.exports = ticketModel