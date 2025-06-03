const { validationResult, matchedData } = require("express-validator");
const tripModel = require("../models/trip");
const routeModel = require("../models/route");
const busModel = require("../models/bus");
const jwt = require('jsonwebtoken');
const seatModel = require("../models/seat");
require('dotenv')

exports.createTrip = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/trips');
        }

        const data = matchedData(req);
        const bus = await busModel.findById(data.bus);
        const route = await routeModel.findById(data.route);

        if (!bus) {
            return res.status(407).send({ error: "Avtobus mavjud emas!" });
        }
        if (!route) {
            return res.status(404).send({ error: "Yo'nalish mavjud emas!" });
        }

        const trip = await tripModel.create({
            route: data.route,
            bus: data.bus,
            departure_date: data.departure_date,
            departure_time: data.departure_time,
            arrival_date: data.arrival_date,
            arrival_time: data.arrival_time,
            vip_price: data.vip_price,
            premium_price: data.premium_price,
            ekonom_price: data.ekonom_price,
            seats: []
        });

        const seatsCount = 51;
        const seats = [];
        for (let i = 1; i <= seatsCount; i++) {
            let seatClass;
            let price;
            if (i >= 1 && i <= 8) {
                seatClass = 'vip';
                price = data.vip_price;
            } else if (i >= 9 && i <= 26) {
                seatClass = 'premium';
                price = data.premium_price;
            } else {
                seatClass = 'economy';
                price = data.ekonom_price;
            }

            const seat = new seatModel({
                seatNumber: i,
                trip: trip._id,
                price: price,
                class: seatClass
            });
            await seat.save();
            seats.push(seat._id);
        }
        trip.seats = seats;
        await trip.save();

        await routeModel.findByIdAndUpdate(route._id, { $push: { trips: trip._id } });
        await busModel.findByIdAndUpdate(bus._id, { trip: trip._id });

        const reverseRoute = await routeModel.findOne({
            from: route.to,
            to: route.from
        });

        if (reverseRoute) {
            const forwardDepDT = new Date(`${data.departure_date}T${data.departure_time}:00`);
            const forwardArrDT = new Date(`${data.arrival_date}T${data.arrival_time}:00`);

            const durationMs = forwardArrDT.getTime() - forwardDepDT.getTime();

            const reverseDepDT = new Date(forwardArrDT.getTime() + 60 * 60 * 1000);

            const reverseArrDT = new Date(reverseDepDT.getTime() + durationMs);

            const isoReverseDep = reverseDepDT.toISOString();
            const isoReverseArr = reverseArrDT.toISOString();

            const reverse_departure_date = isoReverseDep.split('T')[0];
            const reverse_departure_time = isoReverseDep.split('T')[1].substr(0, 5);
            const reverse_arrival_date = isoReverseArr.split('T')[0];
            const reverse_arrival_time = isoReverseArr.split('T')[1].substr(0, 5);

            const reverseTrip = await tripModel.create({
                route: reverseRoute._id,
                bus: data.bus,
                departure_date: reverse_departure_date,
                departure_time: reverse_departure_time,
                arrival_date: reverse_arrival_date,
                arrival_time: reverse_arrival_time,
                vip_price: data.vip_price,
                premium_price: data.premium_price,
                ekonom_price: data.ekonom_price,
                seats: []
            });

            const reverseSeats = [];
            for (let i = 1; i <= seatsCount; i++) {
                let seatClass;
                let price;
                if (i >= 1 && i <= 8) {
                    seatClass = 'vip';
                    price = data.vip_price;
                } else if (i >= 9 && i <= 26) {
                    seatClass = 'premium';
                    price = data.premium_price;
                } else {
                    seatClass = 'economy';
                    price = data.ekonom_price;
                }

                const seat = new seatModel({
                    seatNumber: i,
                    trip: reverseTrip._id,
                    price: price,
                    class: seatClass
                });
                await seat.save();
                reverseSeats.push(seat._id);
            }
            reverseTrip.seats = reverseSeats;
            await reverseTrip.save();

            await routeModel.findByIdAndUpdate(reverseRoute._id, { $push: { trips: reverseTrip._id } });
            await busModel.findByIdAndUpdate(bus._id, { $push: { trip: reverseTrip._id } });

        }

        return res.redirect('/trips');
    } catch (error) {
        console.error(error);
        return res.redirect('/500');
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await tripModel.find().populate('route')
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

        await busModel.findByIdAndUpdate(data.bus, {
            trip: trip._id
        })

        await seatModel.updateMany(
            { bus: data.bus },
            { $set: { price: trip.ticket_price, departure_date: trip.departure_date } }
        );

        return res.redirect('/trips')
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

        await routeModel.findByIdAndUpdate(trip.route, {
            $pull: { trips: trip.id }
        })

        await seatModel.deleteMany({ trip: trip._id })

        await tripModel.findByIdAndDelete(trip._id)

        return res.redirect('/trips')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}