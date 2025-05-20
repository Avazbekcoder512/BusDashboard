const { validationResult, matchedData } = require("express-validator");
const stationModel = require("../models/station");
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.createStation = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/stations');
        }

        const data = matchedData(req);

        const checkStation = await stationModel.findOne({ uz_name: data.uz_name })

        if (checkStation) {
            req.flash('error', "Bunday bekat allaqachon yaratilgan!");
            return res.redirect('/stations')
        }

        const station = await stationModel.create({
            uz_name: data.uz_name,
            ru_name: data.ru_name,
            en_name: data.en_name
        })

        return res.redirect('/stations')

    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getStations = async (req, res) => {
    try {
        const stations = await stationModel.find()
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const admin = jwt.verify(token, process.env.JWT_KEY)

        res.render('stations', {
            title: "Bekatlar",
            stations,
            token,
            gender,
            admin,
            errorFlash: req.flash('error')
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.deleteStation = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/stations')
        }

        const station = await stationModel.findById(id)

        if (!station) {
            req.flash('error', "Bekat topilmadi")
            return res.redirect('/stations')
        }

        await stationModel.findByIdAndDelete(station._id)

        return res.redirect('/stations')
    } catch (error) {
        console.log(error);
        return res.redirect('/500') 
    }
}