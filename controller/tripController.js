const { validationResult, matchedData } = require("express-validator");
const tripModel = require("../models/trip");
const routeModel = require("../models/route");
const busModel = require("../models/bus");
const jwt = require('jsonwebtoken')
require('dotenv')

exports.createTrip = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/trips');
        }

        const data = matchedData(req)

        const trip = await tripModel.create({
            route: data.route,
            bus: data.bus,
            departure_date: data.departure_date,
            departure_time: data.departure_time,
            arrival_date: data.arrival_date,
            arrival_time: data.arrival_time,
            ticket_price: data.ticket_price,
        });

        await routeModel.findByIdAndUpdate(data.route, {
            $push: { trips: trip.id }
        })

        // return res.status(201).send({ message: "Reys muvaffaqiyatli yaratildi!", trip: trip });
        return res.redirect('/trips')

    } catch (error) {
        console.error(error);
        return res.redirect('/500')
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await tripModel.find().populate('route').populate('bus')
        const bus = await busModel.find()
        const route = await routeModel.find()
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const admin = jwt.verify(token, process.env.JWT_KEY)

        // return res.status(200).send({
        //     trips
        // })

        return res.render("trips", {
            title: "Reyslar",
            token,
            bus,
            route,
            trips,
            gender,
            admin,
            errorFlash: req.flash('error')
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getOneTrip = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken
        const admin = jwt.verify(token, process.env.JWT_KEY)
        const route = await routeModel.find()
        const bus = await busModel.find()

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/trips')
        }

        const trip = await tripModel.findById(id).populate('route')

        if (!trip) {
            req.flash('error', 'Reys topilmadi!')
            return res.redirect('/trips')
        }

        // return res.status(200).send({
        //     trip: trip
        // })
        return res.render('trip', {
            title: "Reys",
            token,
            layout: false,
            trip,
            route,
            bus,
            admin,
            errorFlash: req.flash('error')
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/trips')
        }

        const trip = await tripModel.findById(id)

        if (!trip) {
            req.flash('error', 'Reys topilmadi!')
            return res.redirect('/trips')
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg));
            return res.redirect(`/trip/${id}`);
        }
        const data = matchedData(req)

        const newTrip = {
            route: data.route || trip.route,
            bus: data.bus || trip.bus,
            departure_date: data.departure_date || trip.departure_date,
            departure_time: data.departure_time || trip.departure_time,
            arrival_date: data.arrival_date || trip.arrival_date,
            arrival_time: data.arrival_time || trip.arrival_time,
            ticket_price: data.ticket_price || trip.ticket_price,
        }

        await tripModel.findByIdAndUpdate(id, newTrip, { new: true })

        return res.status(201).send({
            message: "Reys muvaffaqiyatli yangilandi!",
            data: newTrip
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/trips')
        }

        const trip = await tripModel.findById(id)

        if (!trip) {
            req.flash('error', 'Reys topilmadi!')
            return res.redirect('/trips')
        }

        await tripModel.findByIdAndDelete(id)

        return res.redirect('/trips')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}