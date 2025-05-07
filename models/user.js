const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    first_Name: String,
    last_Name: String,
    password: String,
    gender: String,
    phoneNumber: String,
    register_code: String,
    smsCode: String,
    bank_card: String,
    expiryDate: String,
    passport: String,
    verification_code: Number,
    image: String,
    last_Login: { type: Date, default: null },
    ticket: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
    tempTicketId: [{ type: mongoose.Schema.Types.ObjectId, ref: "tempTicket" }]
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel