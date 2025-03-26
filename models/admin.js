const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    gender: String,
    role: { type: String, enum: ['superAdmin', "admin"] },
    image: String
}, { timestamps: true })

const adminModel = mongoose.model("Admin", adminSchema)
module.exports = adminModel