const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
}, { timestamps: true })

const routeModel = mongoose.model("Route", routeSchema)
module.exports = routeModel