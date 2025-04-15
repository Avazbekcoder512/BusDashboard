const busModel = require("../models/bus")
const stationModel = require("../models/station")
const routeModel = require("../models/route")
const jwt = require('jsonwebtoken')
require('dotenv')

exports.searchRoute = async (req, res) => {
    try {
        const city = await stationModel.find()
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const from = req.query.from
        const to = req.query.to
        const departure_date = req.query.departure_date
        const user = jwt.verify(token, process.env.JWT_KEY)
        const admin = jwt.verify(token, process.env.JWT_KEY)

        if (!from || !to || !departure_date) {
            req.flash('error', 'Iltimos, 3 ta maydonni ham kiriting!')
            return res.redirect('/tickets')
        }

        const data = await routeModel.findOne({ from: from, to: to }).populate({
            path: 'trips',
            match: { departure_date }
        })

        return res.render('ticket', {
            token,
            gender,
            data,
            city,
            user,
            admin,
            errorFlash: req.flash('error')
        })


    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getTicket = async (req, res) => {
    try {
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const user = jwt.verify(token, process.env.JWT_KEY)
        const city = await stationModel.find()
        const tickets = await routeModel.find().populate('trips')

        if (user.role === "ticket_seller") {
            return res.render('ticket', {
                token,
                gender,
                city,
                tickets,
                user,
                errorFlash: req.flash('error')
            })
        } else {
            return res.render('ticket', {
                token,
                gender,
                city,
                tickets,
                admin: user,
                errorFlash: req.flash('error')
            })
        }


        // return res.send({
        //     tickets: tickets
        // })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getSeats = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/tickets')
        }

        const bus = await busModel.findById(id).populate("seats")

        if (!bus) {
            req.flash('error', 'Avtobus topilmadi!')
            return res.redirect('/tickets')
        }

        return res.render('seats', {
            bus,
            token,
            layout: false
        })

        // return res.status(200).send({
        //     bus
        // })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}