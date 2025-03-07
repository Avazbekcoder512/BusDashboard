const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin")
require('dotenv').config()
const bcrypt = require("bcrypt")
const driverModel = require("../models/driver")
const { validationResult, matchedData } = require("express-validator")

const generateToken = (id, role) => {
    const payload = { id, role }
    return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" })
}

exports.loginPage = async (req, res) => {
    return res.render("login", {
        token: res.cookie.authToken,
        layout: false,
        title: "Login"
    })
}

exports.login = async (req, res) => {
    try {
        console.log(req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);

        let user = await adminModel.findOne({ username: data.username })

        if (user) {
            const checkPassword = await bcrypt.compare(data.password, user.password)

            if (!checkPassword) {
                return res.status(403).send({
                    error: "Parol xato!"
                })
            }

            const authToken = generateToken(user._id, user.role)
            console.log(authToken);
            

            res.cookie("authToken", authToken, { secure: true })

            return res.redirect("/")
        }

        user = await driverModel.findOne({ username: data.username })

        if (user) {
            const checkPassword = await bcrypt.compare(data.password, user.password)

            if (!checkPassword) {
                return res.status(403).send({
                    error: "Parol xato!"
                })
            }

            const authToken = generateToken(user._id, user.role)

            res.cookie("authToken", authToken, { secure: true })

            return res.redirect("/")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}