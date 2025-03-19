const { validationResult, matchedData } = require("express-validator");
const tripModel = require("../models/trip");
const routeModel = require("../models/route");

exports.createTrip = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ error: errors.array().map((error) => error.msg) });
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

        return res.status(201).send({ message: "Reys muvaffaqiyatli yaratildi!", trip: trip });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Serverda xatolik!" });
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await tripModel.find().populate('route')
        const token = req.cookies.authToken
        const gender = req.cookies.gender

        if (!trips.length) {
            return res.status(404).send({
                error: "Yo'nalishlar topilmadi!"
            })
        }

        // return res.status(200).send({
        //     trips
        // })

        return res.render("trips", {
            title: "Reyslar",
            token,
            trips,
            gender
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getOneTrip = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const trip = await tripModel.findById(id).populate('route')

        if (!trip) {
            return res.status(404).send({
                error: "Reys topilmadi!"
            })
        }

        // return res.status(200).send({
        //     trip: trip
        // })
        return res.render('trip', {
            title: "Reys",
            token,
            layout: false,
            trip
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.updateTrip = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const trip = await tripModel.findById(id)

        if (!trip) {
            return res.status(404).send({
                error: "Reys topilmadi!"
            })
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg)
            })
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
            data: newRoute
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params

        const trip = await tripModel.findById(id)

        if (!trip) {
            return res.status(404).send({
                error: "Reys topilmadi!"
            })
        }

        await tripModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Reys muvaffaqiyatli o'chirildi!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}