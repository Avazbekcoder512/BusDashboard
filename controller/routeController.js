const { validationResult, matchedData } = require("express-validator");
const routeModel = require("../models/route");

exports.createRoute = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg)
            })
        }

        const data = matchedData(req)

        for (let i = 0; i < 2; i++) {
            const departureDate = new Date();
            departureDate.setDate(departureDate.getDate() + i);
            const formattedDepartureDate = departureDate.toISOString().split("T")[0];

            const arrivalDate = new Date(departureDate);
            arrivalDate.setDate(arrivalDate.getDate() + (data.arrival_days || 1));
            const formattedArrivalDate = arrivalDate.toISOString().split("T")[0];

            await routeModel.create({
                name: data.from + ' ' + data.to,
                from: data.from,
                to: data.to,
                departure_time: data.departure_time,
                arrival_time: data.arrival_time,
                departure_date: formattedDepartureDate,
                arrival_date: formattedArrivalDate,
                price: data.price,
                bus_id: data.bus_id,
            });

            const returnDepartureDate = new Date(formattedArrivalDate);
            returnDepartureDate.setDate(returnDepartureDate.getDate());
            const formattedReturnDepartureDate = returnDepartureDate.toISOString().split("T")[0];

            const returnArrivalDate = new Date(returnDepartureDate);
            returnArrivalDate.setDate(returnArrivalDate.getDate() + 1);
            const formattedReturnArrivalDate = returnArrivalDate.toISOString().split("T")[0];

            await routeModel.create({
                name: data.to + ' ' + data.from,
                from: data.to,
                to: data.from,
                departure_time: data.arrival_time,
                arrival_time: data.departure_time,
                departure_date: formattedReturnDepartureDate,
                arrival_date: formattedReturnArrivalDate,
                price: data.price,
                bus_id: data.bus_id,
            });
        }

        return res.status(201).send({
            message: "Yo'nalish muvaffaqiyatli yaratildi!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        });
    }
}

exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await routeModel.find()
        const token = req.cookies.authToken

        if (!routes.length) {
            return res.status(404).send({
                error: "Yo'nalishlar topilmadi!"
            })
        }

        return res.status(200).send({
            routes
        })

        // return res.render("routes", {
        //     title: "Yo'nalishlar",
        //     token,
        //     routes
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "SErverda xatolik!"
        })
    }
}

exports.updateRouter = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const route = await routeModel.findById(id)

        if (!route) {
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

        const newRoute = {
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

exports.deleteRoute = async (req, res) => {
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