const { validationResult, matchedData } = require("express-validator");
const routeModel = require("../models/route");


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

        return res.status(201).send({
            message: "Yo'nalish muvaffaqiyatli yaratildi!",
            route
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getAllRoutes = async (req, res) => {
    try {
        const routes = await routeModel.find()

        if (!routes.length) {
            return res.status(404).send({
                error: "Yo'nalishlar topilmadi!"
            })
        }

        // return res.render('/routes', {
        //     routes
        // })
        return res.status(200).send({
            routes
        })
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

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const route = await routeModel.findById(id)

        if (!route) {
            return res.status(404).send({
                error: "Yo'nalish topilmadi"
            })
        }

        return res.status(200).send({
            route
        })
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

        await routeModel.findByIdAndDelete(id)

        return res.status(200).send({
            message: "Masofa muvaffaqiyatli o'chirildi!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}