const mongoose = require('mongoose')

const busSchema = new mongoose.Schema({
    bus_number: String,
    bus_model: String,
    seats_count: Number,
    trip: {type: mongoose.Schema.Types.ObjectId, ref: "Trip"},
    seats: [{type: mongoose.Schema.Types.ObjectId, ref: "Seat"}],
    driver: {type: mongoose.Schema.Types.ObjectId, ref: "Driver"},
    image: String,
}, { timestamps: true })

const busModel = mongoose.model("Bus", busSchema)
module.exports = busModel