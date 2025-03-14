const mongoose = require('mongoose')

const busSchema = new mongoose.Schema({
    number: String,
    model: String,
    seats_count: Number,
    seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
    image: String,
}, { timestamps: true })

const busModel = mongoose.model("Bus", busSchema)
module.exports = busModel