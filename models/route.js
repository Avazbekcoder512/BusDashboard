const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    uz_name: String,
    ru_name: String,
    en_name: String,
    from: String,
    to: String,
    trips: [{type: mongoose.Schema.Types.ObjectId, ref: "Trip"}]
}, { timestamps: true })

const routeModel = mongoose.model("Route", routeSchema)
module.exports = routeModel