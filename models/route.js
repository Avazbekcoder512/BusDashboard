const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    name: String,
    from: String,
    to: String,
    price: Number,
    date: Date,
    time: {type: String,  match: /^([01]\d|2[0-3]):([0-5]\d)$/},
    buses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Bus'}]
}, {timestamps: true})

const routeModel = mongoose.model("Route", routeSchema)
module.exports = routeModel