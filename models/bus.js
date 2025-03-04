const mongoose = require('mongoose')

const busSchema = new mongoose.Schema({
    modeli: String,
    image: String,
    seats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Seat" }],
    route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
    status: { type: String, enum: ["active", "inactive", "completed", "maintenance"], default: "active" }
}, { timestamps: true })

const busModel = mongoose.model("Bus", busSchema)
module.exports = busModel