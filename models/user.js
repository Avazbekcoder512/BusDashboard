const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phoneNumber: String,
    bank_card: String,
    image: String,
    ticket: {type: mongoose.Schema.Types.ObjectId, ref: "Ticket"}
})