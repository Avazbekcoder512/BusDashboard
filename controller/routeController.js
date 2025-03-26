const { validationResult, matchedData } = require("express-validator");
const routeModel = require("../models/route");
const tripModel = require("../models/trip");
const cityModel = require("../models/city");
const jwt = require('jsonwebtoken')


exports.createRoute = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({ error: errors.array().map((error) => error.msg) })
        }
        const data = matchedData(req)

        const route = await routeModel.create({
            name: data.name,
            from: data.from,
            to: data.to
        })

        const existingCity = await cityModel.findOne({ name: data.from })

        if (!existingCity) {
            const city = await cityModel.create({
                name: data.from
            })
        }

        return res.redirect('/routes')
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await routeModel.find().populate("trips")
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const user = jwt.verify(token, process.env.JWT_KEY)

        return res.render('routes', {
            routes,
            token,
            gender,
            title: "Yo'nalishlar",
            user
        })
        // return res.status(200).send({
        //     routes
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getOneRoutes = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const route = await routeModel.findById(id).populate('trips')

        if (!route) {
            return res.status(404).send({
                error: "Yo'nalish topilmadi"
            })
        }

        return res.render('route', {
            route,
            token,
            layout: false,
        })

        // return res.status(200).send({
        //     route
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.updateRoute = async (req, res) => {
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
            return res.status(400).send({ error: errors.array().map((error) => error.msg) })
        }
        const data = matchedData(data)

        const newRoute = {
            name: data.name || route.name,
            from: data.from || route.from,
            to: data.to || route.to
        }

        const existingCity = await cityModel.findOne({ name: data.from })

        if (!existingCity) {
            const city = await cityModel.create({
                name: data.from
            })
        }

        await routeModel.findByIdAndUpdate(id, newRoute)

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.deleteRoute = async (req, res) => {
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

        await tripModel.deleteMany({ route: id })

        await routeModel.findByIdAndDelete(id)

        return res.redirect('/routes')
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}