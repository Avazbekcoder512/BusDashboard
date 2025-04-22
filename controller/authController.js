const jwt = require("jsonwebtoken")
const adminModel = require("../models/admin")
require('dotenv').config()
const bcrypt = require("bcrypt")
const { validationResult, matchedData } = require("express-validator")
const ticketSellerModel = require("../models/ticket_seller")

const generateToken = (id, role, name) => {
    const payload = { id, role, name }
    return jwt.sign(payload, process.env.JWT_KEY, { expiresIn: "1d" })
}

exports.loginPage = async (req, res) => {
    return res.render("login", {
        token: res.cookie.authToken,
        layout: false,
        title: "Login",
        errorFlash: req.flash('error')
    })
}

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map((error) => error.msg).join("<br>"))
            return res.redirect('/login')
        }
        const data = matchedData(req);

        let user = await adminModel.findOne({ username: data.username })

        if (user) {
            const checkPassword = await bcrypt.compare(data.password, user.password)

            if (!checkPassword) {
                req.flash('error', 'Parol xato!')
                return res.redirect('/login')
            }

            const authToken = generateToken(user._id, user.role, user.name)
            const gender = user.gender

            res.cookie("authToken", authToken, { secure: true })
            res.cookie('gender', gender)

            return res.redirect("/")
        }

        user = await ticketSellerModel.findOne({ username: data.username })

        if (user) {
            const checkPassword = await bcrypt.compare(data.password, user.password)

            if (!checkPassword) {
                req.flash('error', 'Parol xato!')
                return res.redirect('/login')
            }

            const authToken = generateToken(user._id, user.role, user.name)
            const gender = user.gender

            res.cookie("authToken", authToken, { secure: true })
            res.cookie('gender', gender)

            return res.redirect("/search-route")
        }

        if (!user) {
            req.flash('error', "Bunday usernamega ega user topilmadi!")
            return res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
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
        return res.redirect('/500')
    }
}