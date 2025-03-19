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
                return res.redirect('/login')
            }

            const authToken = generateToken(user._id, user.role)
            const gender = user.gender        

            res.cookie("authToken", authToken, { secure: true })
            res.cookie('gender', gender)

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
            const gender = user.gender        

            res.cookie("authToken", authToken, { secure: true })
            res.cookie('gender', gender)

            return res.redirect("/")
        } 
        if (!user) {
            return res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.authToken
        if (!token) {
            return res.redirect('/login')
        }

        res.clearCookie('authToken')
        res.clearCookie('gender')
        return res.redirect('/login')
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        }) 
    }
}