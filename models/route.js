const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    departure_time: String,
    arrival_time: String,
    departure_date: String,
    arrival_date: String,
    price: Number,
    bus_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }],
}, { timestamps: true })

const routeModel = mongoose.model("Route", routeSchema)
module.exports = routeModel