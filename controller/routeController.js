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
            startPoint: data.startPoint,
            endPoint: data.endPoint,
            time: data.time,
        })

        return res.status(201).send({
            message: "Yo'nali muvaffaqiyatli yaratildi!",
            route: route
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