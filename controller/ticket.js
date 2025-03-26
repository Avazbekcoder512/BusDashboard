const busModel = require("../models/bus")
const cityModel = require("../models/city")
const routeModel = require("../models/route")
const jwt = require('jsonwebtoken')
require('dotenv')

exports.searchRoute = async (req, res) => {
    try {
        const city = await cityModel.find()
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const from = req.query.from
        const to = req.query.to
        const departure_date = req.query.departure_date
        const user = jwt.verify(token, process.env.JWT_KEY)

        if (!from || !to || !departure_date) {
            return res.status(400).send({
                error: "Iltimos, 3 ta maydonni ham to'g'ri kiriting!"
            })
        }

        const data = await routeModel.findOne({ from: from, to: to }).populate({
            path: 'trips',
            match: { departure_date }
        })

        return res.render('ticket', {
            token,
            gender,
            data,
            city,
            user
        })


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getTicket = async (req, res) => {
    try {
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const user = jwt.verify(token, process.env.JWT_KEY)
        const city = await cityModel.find()
        const tickets = await routeModel.find().populate('trips')

        return res.render('ticket', {
            token,
            gender,
            city,
            tickets,
            user
        })

        // return res.send({
        //     tickets: tickets
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getSeats = async (req, res) => {
    try {
        const { id } = req.params
        const token = req.cookies.authToken

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const bus = await busModel.findById(id).populate("seats")

        if (!bus) {
            return res.status(404).send({
                error: "Avtobus topilmadi!"
            })
        }

        return res.render('seats', {
            bus,
            token,
            layout: false
        })

        // return res.status(200).send({
        //     bus
        // })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}