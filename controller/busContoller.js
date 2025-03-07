const { validationResult, matchedData } = require("express-validator");
const busModel = require("../models/bus");
const { createClient } = require("@supabase/supabase-js");
const seatModel = require("../models/seat");
require('dotenv').config()

const supabase = createClient(
    process.env.Supabase_Url,
    process.env.Anon_key,
);

exports.createBus = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg)
            })
        }

        const data = matchedData(req)

        // if (!req.file) {
        //     return res.status(400).send({
        //         error: "Iltimos, rasm faylni yuklang!",
        //     });
        // }

        // const maxFileSize = 5 * 1024 * 1024;
        // if (req.file.size > maxFileSize) {
        //     return res.status(400).send({
        //         error: "Rasm hajmi 5 MB dan oshmasligi kerak!",
        //     });
        // }

        // const { buffer, originalname } = req.file;
        // const fileName = `admins/${Date.now()}-${originalname}`;

        // const { data: uploadData, error: uploadError } = await supabase.storage
        //     .from("mbus_bucket")
        //     .upload(fileName, buffer, {
        //         cacheControl: "3600",
        //         upsert: false,
        //         contentType: req.file.mimetype,
        //     });

        // if (uploadError) {
        //     throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
        // }

        // const fileUrl = `${supabase.storageUrl}/object/public/mbus_bucket/${fileName}`;

        const bus = await busModel.create({
            model: data.model,
            // image: fileUrl
            seats: [],
            status: data.status
        })

        let seats = [];
        for (let i = 1; i <= data.seatsCount; i++) {
            let seat = new seatModel({ seetNumber: i, bus: bus._id });
            await seat.save();
            seats.push(seat._id);
        }

        bus.seats = seats;
        await bus.save();

        return res.status(201).send({
            message: "Avtobus muvaffaqiyatli yaratildi!",
            bus
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await busModel.find()

        if (!buses.length) {
            return res.status(404).send({
                error: "Avtobuslar topilmadi!"
            })
        }

        return res.render('buses', {
            title: "Buses",
            buses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getOneBus = async (req, res) => {
    try {
        const { id } = req.params

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

        return res.status(200).send({
            bus
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}