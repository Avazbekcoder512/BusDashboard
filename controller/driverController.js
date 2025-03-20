const { validationResult, matchedData } = require("express-validator");
const driverModel = require("../models/driver");
const busModel = require("../models/bus");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config()

const supabase = createClient(
    process.env.Supabase_Url,
    process.env.Anon_key,
);

exports.createDriver = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg)
            })
        }
        const data = matchedData(req)

        if (!req.file) {
            return res.status(400).send({
                error: "Iltimos, rasm faylni yuklang!",
            });
        }

        const maxFileSize = 5 * 1024 * 1024;
        if (req.file.size > maxFileSize) {
            return res.status(400).send({
                error: "Rasm hajmi 5 MB dan oshmasligi kerak!",
            });
        }

        const { buffer, originalname } = req.file;
        const fileName = `drivers/${Date.now()}-${originalname}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("mbus_bucket")
            .upload(fileName, buffer, {
                cacheControl: "3600",
                upsert: false,
                contentType: req.file.mimetype,
            });

        if (uploadError) {
            throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
        }

        const fileUrl = `${supabase.storageUrl}/object/public/mbus_bucket/${fileName}`;

        const driver = await driverModel.create({
            name: data.name,
            phoneNumber: data.phoneNumber,
            experience: data.experience,
            gender: data.gender,
            bus: data.bus,
            image: fileUrl
        })

        return res.redirect('/drivers')
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.find().populate("bus")
        const bus = await busModel.find()
        const gender = req.cookies.gender
        const token = req.cookies.authToken

        if (!drivers.length) {
            return res.status(404).send({
                error: "Haydovchilar topilmadi!"
            })
        }

        return res.render('drivers', {
            drivers,
            bus,
            token,
            gender,
            title: "Haydovchilar"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}