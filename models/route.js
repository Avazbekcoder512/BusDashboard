const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    startPoint: String,
    endPoint: String,
    buses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bus'}]
}, {timestamps: true})

const routeModel = mongoose.model("Route", routeSchema)
module.exports = routeModel