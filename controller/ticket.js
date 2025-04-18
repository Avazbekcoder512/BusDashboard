const busModel = require("../models/bus")
const stationModel = require("../models/station")
const routeModel = require("../models/route")
const jwt = require('jsonwebtoken')
const tripModel = require("../models/trip")
const seatModel = require("../models/seat")
const ticketModel = require("../models/ticket")
const ticketSellerModel = require("../models/ticket_seller")
const { validationResult, matchedData } = require("express-validator")
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
            return res.redirect('/search-trip')
        }

        const data = await routeModel.findOne({ from: from, to: to }).populate({
            path: 'trips',
            match: { departure_date }
        })

        return res.render('ticketBooked', {
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

exports.getTrips = async (req, res) => {
    try {
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const user = jwt.verify(token, process.env.JWT_KEY)
        const city = await stationModel.find()
        const trip = await routeModel.find().populate('trips')

        if (user.role === "ticket_seller") {
            return res.render('ticketBooked', {
                token,
                gender,
                city,
                trip,
                user,
                errorFlash: req.flash('error')
            })
        } else {
            return res.render('ticketBooked', {
                token,
                gender,
                city,
                trip,
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
            return res.redirect('/search-trip')
        }


        const trip = await tripModel
            .findById(id)
            .populate('seats')
            .populate('route');

        if (!trip) {
            req.flash('error', 'Reys topilmadi!');
            return res.redirect('/search-trip');
        }

        return res.render('seats', {
            trip,
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

exports.seatBooked = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken

        const decoded = jwt.verify(token, process.env.JWT_KEY)

        const userId = decoded.id

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri!")
            return res.redirect('/search-trip')
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map((error) => error.msg).join("<br>"))
            return res.redirect('/search-trip')
        }

        const data = matchedData(req)
        console.log(data);

        const seat = await seatModel.findById(id)

        if (!seat) {
            req.flash('error', "O'rindiq topilmadi!")
            return res.redirect('/search-trip')
        }
        const trip = await tripModel.findById(seat.trip)

        if (!trip) {
            req.flash('error', "Reys topilmadi!")
            return res.redirect('/search-trip')
        }

        const bus = await busModel.findById(trip.bus)

        if (!bus) {
            req.flash('error', "Avtobus topilmadi!")
            return res.redirect('/search-trip')
        }

        const route = await routeModel.findById(trip.route)

        if (!route) {
            req.flash('error', "Yo'nalish topilmadi!")
            return res.redirect('/search-trip')
        }

        const ticket = await ticketModel.create({
            passenger: data.passenger,
            birthday: data.birthday,
            passport: data.passport,
            phoneNumber: data.phoneNumber,
            seat_number: seat.seatNumber,
            seat: seat._id,
            bus_number: bus.bus_number,
            from: route.from,
            to: route.to,
            departure_date: trip.departure_date,
            departure_time: trip.departure_time,
            price: seat.price
        })

        await ticketSellerModel.findByIdAndUpdate(userId, {
            $push: { tickets: ticket._id }
        })

        await seatModel.findByIdAndUpdate(seat._id, {
            status: "busy"
        })

        return res.redirect('/search-trip')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}   