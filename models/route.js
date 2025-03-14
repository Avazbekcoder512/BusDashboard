const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    departure_time: Date,
    arrival_time: Date,
    price: Number,
    distance: Number,
    bus_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bus' }],
    status: { type: String, enum: ["Pending", "Active", "Completed"], default: "Pending" }
}, { timestamps: true })

const routeModel = mongoose.model("Route", routeSchema)
module.exports = routeModel