const mongoose = require('mongoose')

const busSchema = new mongoose.Schema({
    bus_number: String,
    bus_model: String,
    seats_count: Number,
    seats: [{type: mongoose.Schema.Types.ObjectId, ref: "Seat"}],
    driver_id: {type: mongoose.Schema.Types.ObjectId, ref: "Driver"},
    image: String,
}, { timestamps: true })

const busModel = mongoose.model("Bus", busSchema)
module.exports = busModel