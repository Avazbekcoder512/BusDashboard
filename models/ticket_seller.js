const mongoose = require('mongoose')

const ticketSellerSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    phoneNumber: String,
    gender: String,
    role: { type: String, default: "ticket seller" },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus"},
    image: String
}, { timestamps: true })

const ticketSellerModel = mongoose.model('ticket seller', ticketSellerSchema)
module.exports = ticketSellerModel