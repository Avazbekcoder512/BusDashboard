const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    role: {type: String, enum: ["admin", "superadmin"]}
}, {timestamps: true})

const adminModel = mongoose.model("Admin", adminSchema)
module.exports = adminModel