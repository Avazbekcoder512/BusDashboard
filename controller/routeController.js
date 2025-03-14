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

        const route = routeModel.create({
            name: data.name,
            from: data.from,
            to: data.to,
            departure_time: data.departure_time,
            arrival_time: data.arrival_time,
            price: data.price,
            distance: data.distance,
            bus_id: data.bus_id
        })

        return res.status(201).send({
            message: "Yo'nali muvaffaqiyatli yaratildi!",
            data: route
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "SErverda xatolik!"
        })
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

        return res.render("routes", {
            title: "Yo'nalishlar",
            token,
            routes
        })
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

        await routeModel.findByIdAndUpdate(id, newRoute, {new: true})

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