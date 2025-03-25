const monggose = require('mongoose')

const citySchema = new monggose.Schema({
    name: String
}, { timestamps: true }) 

const cityModel = monggose.model("City", citySchema)
module.exports = cityModel