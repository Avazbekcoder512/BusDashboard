const { validationResult, matchedData } = require("express-validator");
const routeModel = require("../models/route");
const tripModel = require("../models/trip");
const jwt = require('jsonwebtoken');
const stationModel = require("../models/station");


exports.createRoute = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/routes');
        }

        const data = matchedData(req);

        const route = await routeModel.create({
            uz_name: data.uz_name,
            ru_name: data.ru_name,
            en_name: data.en_name,
            uz_from: data.uz_from,
            uz_to: data.uz_to,
            ru_from: data.ru_from,
            ru_to: data.ru_to,
            en_from: data.en_from,
            en_to: data.en_to
        });
        return res.redirect('/routes');
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
};

exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await routeModel.find().populate("trips")
        const station = await stationModel.find()
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const admin = jwt.verify(token, process.env.JWT_KEY)

        return res.render('routes', {
            routes,
            station,
            token,
            gender,
            title: "Yo'nalishlar",
            admin,
            errorFlash: req.flash('error')
        })
        // return res.status(200).send({
        //     routes
        // })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getOneRoutes = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken
        const admin = jwt.verify(token, process.env.JWT_KEY)

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/routes')
        }

        const route = await routeModel.findById(id).populate('trips')

        if (!route) {
            req.flash('error', "Yo'nalish topilmadi")
            return res.redirect('/routes')
        }

        return res.render('route', {
            route,
            token,
            admin,
            layout: false,
            errorFlash: req.flash('error')
        })

        // return res.status(200).send({
        //     route
        // })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.updateRoute = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/routes')
        }

        const route = await routeModel.findById(id)

        if (!route) {
            req.flash('error', "Yo'nalish topilmadi")
            return res.redirect('/routes')
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg));
            return res.redirect(`/route/${id}`);
        }
        const data = matchedData(data)

        const newRoute = {
            uz_name: data.uz_name || route.uz_name,
            ru_name: data.ru_name || route.ru_name,
            en_name: data.en_name || route.en_name,
            from: data.from || route.from,
            to: data.to || route.to
        }

        await routeModel.findByIdAndUpdate(id, newRoute)

    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.deleteRoute = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/routes')
        }

        const route = await routeModel.findById(id)

        if (!route) {
            req.flash('error', "Yo'nalish topilmadi")
            return res.redirect('/routes')
        }

        await tripModel.deleteMany({ route: id })

        await routeModel.findByIdAndDelete(id)

        return res.redirect('/routes')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}