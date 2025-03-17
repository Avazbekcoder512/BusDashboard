const { validationResult, matchedData } = require("express-validator");
const tripModel = require("../models/trip");

exports.createTrip = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ error: errors.array().map((error) => error.msg) });
        }

        const data = matchedData(req)

        const trip = await tripModel.create({
            route_id: data.route_id,
            bus_id: data.bus_id,
            departure_date: data.departure_date,
            departure_time: data.departure_time,
            arrival_date: data.arrival_date,
            arrival_time: data.arrival_time,
            ticket_price: data.ticket_price,
        });

        // const returnDepartureDate = new Date(arrivalDate);
        // const returnArrivalDate = new Date(returnDepartureDate);
        // returnArrivalDate.setDate(returnArrivalDate.getDate() + travelDays);

        // await routeModel.create({
        //     name: `${data.to} ${data.from}`,
        //     from: data.to,
        //     to: data.from,
        //     departure_time: data.arrival_time,
        //     arrival_time: data.departure_time,
        //     departure_date: returnDepartureDate.toISOString().split("T")[0],
        //     arrival_date: returnArrivalDate.toISOString().split("T")[0],
        //     price: data.price,
        //     bus_id: data.bus_id,
        //     distance: data.distance,
        // });

        return res.status(201).send({ message: "Reys muvaffaqiyatli yaratildi!", trip: trip });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Serverda xatolik!" });
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await tripModel.find().populate('routes')
        const token = req.cookies.authToken

        if (!trips.length) {
            return res.status(404).send({
                error: "Yo'nalishlar topilmadi!"
            })
        }

        return res.status(200).send({
            trips
        })

        // return res.render("routes", {
        //     title: "Yo'nalishlar",
        //     token,
        //     routes
        // })
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

        return res.status(200).send({
            trip: trip
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
                error: "Yo'nalish topilmadi!"
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
            name: data.name || route.name,
            from: data.from || route.from,
            to: data.to || route.to,
            departure_time: data.departure_time || route.departure_time,
            arrival_time: data.arrival_time || route.arrival_time,
            price: data.price || route.price,
            distance: data.distance || route.distance,
            bus_id: data.bus_id || route.bus_id
        }

        await routeModel.findByIdAndUpdate(id, newRoute, { new: true })

        return res.status(201).send({
            message: "Yo'nalish muvaffaqiyatli yangilandi!",
            data: newRoute
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "SErverda xatolik!"
        })
    }
}

exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params

        const route = await routeModel.findById(id)

        if (!route) {
            return res.status(404).send({
                error: "Yo'nalish topilmadi!"
            })
        }

        await routeModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Yo'nalish muvaffaqiyatli o'chirildi!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "SErverda xatolik!"
        })
    }
}