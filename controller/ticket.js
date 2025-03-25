const cityModel = require("../models/city")
const routeModel = require("../models/route")


exports.getTicket = async (req, res) => {
    try {
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const city = await cityModel.find()

        res.locals.token = token
        res.locals.gender = gender
        res.locals.city = city

        return res.render('ticket')
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}