const { validationResult, matchedData } = require("express-validator");
const driverModel = require("../models/driver");
const busModel = require("../models/bus");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const supabase = createClient(
    process.env.Supabase_Url,
    process.env.Anon_key,
);

exports.createDriver = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/drivers');
        }
        const data = matchedData(req)

        const condidat = await driverModel.findOne({ username: data.username })

        if (condidat) {
            req.flash('error', "Bunday usernamega ega foydalanuvchi allaqchon ro'yhatdan o'tgan!")
            return res.redirect('/drivers');
        }

        if (!req.file) {
            req.flash('error', 'Iltimos, rasm faylni yuklang!')
            return res.redirect('/drivers')
        }

        const maxFileSize = 5 * 1024 * 1024;
        if (req.file.size > maxFileSize) {
            req.flash('error', 'Rasm hajmi 5 MB dan oshmasligi kerak!')
            return res.redirect('/drivers')
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

        const passwordHash = await bcrypt.hash(data.password, 12)
        delete data.password

        const driver = await driverModel.create({
            name: data.name,
            username: data.username,
            password: passwordHash,
            phoneNumber: data.phoneNumber,
            experience: data.experience,
            gender: data.gender,
            bus: data.bus,
            image: fileUrl
        })

        return res.redirect('/drivers')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getAllDrivers = async (req, res) => {
    try {
        const drivers = await driverModel.find().populate("bus")
        const bus = await busModel.find()
        const gender = req.cookies.gender
        const token = req.cookies.authToken
        const admin = jwt.verify(token, process.env.JWT_KEY)

        return res.render('drivers', {
            drivers,
            bus,
            token,
            gender,
            title: "Haydovchilar",
            admin,
            errorFlash: req.flash('error')
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.updateDriver = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/drivers')
        }

        const driver = await driverModel.findById(id);

        if (!driver) {
            req.flash('error', 'Haydovchi topilmadi!')
            return res.redirect('/drivers')
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/drivers');
        }
        const data = matchedData(req);

        let fileUrl = driver.image;

        if (req.file) {
            try {
                const maxFileSize = 5 * 1024 * 1024;
                if (req.file.size > maxFileSize) {
                    req.flash('error', 'Rasm hajmi 5 MB dan oshmasligi kerak!')
                    return res.redirect('/drivers')
                }

                if (fileUrl) {
                    const filePath = fileUrl.replace(
                        `${supabase.storageUrl}/object/public/mbus_bucket/`,
                        ""
                    );

                    const { data: fileExists, error: checkError } = await supabase.storage
                        .from("mbus_bucket")
                        .list("", { prefix: filePath });

                    if (checkError) {
                        console.error(
                            `Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`
                        );
                    } else if (fileExists && fileExists.length > 0) {
                        const { error: deleteError } = await supabase.storage
                            .from("mbus_bucket")
                            .remove([filePath]);

                        if (deleteError) {
                            throw new Error(
                                `Faylni o'chirishda xatolik: ${deleteError.message}`
                            );
                        }
                    }
                }

                const { buffer, originalname } = req.file;
                const fileName = `drivers/${Date.now()}-${originalname}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("mbus_bucket")
                    .upload(fileName, buffer, {
                        cacheControl: "3600",
                        upsert: true,
                        contentType: req.file.mimetype,
                    });

                if (uploadError) {
                    throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
                }

                fileUrl = `${supabase.storageUrl}/object/public/mbus_bucket/${fileName}`;
            } catch (err) {
                console.error(`Faylni yangilashda xatolik: ${err.message}`);
                throw new Error(
                    "Yangi faylni yuklash yoki eski faylni o‘chirishda muammo!"
                );
            }
        }

        const condidat = await driverModel.findOne({ username: data.username })

        if (condidat) {
            req.flash('error', "Bunday usernamega ega foydalanuvchi allaqchon ro'yhatdan o'tgan!")
            return res.redirect('/drivers');
        }

        const updatedDriver = {
            name: data.name || driver.name,
            username: data.username || driver.password,
            phoneNumber: data.phoneNumber || driver.phoneNumber,
            experience: data.experience || driver.experience,
            gender: data.gender || driver.gender,
            bus: data.bus || driver.bus,
            image: fileUrl || driver.image
        }

        await driverModel.findByIdAndUpdate(id, updatedDriver)

        return res.redirect('/drivers')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/drivers')
        }

        const driver = await driverModel.findById(id);
        if (!driver) {
            req.flash('error', 'Haydovchi topilmadi!')
            return res.redirect('/drivers')
        }

        const fileUrl = driver.image

        if (fileUrl) {
            const filePath = fileUrl.replace(`${supabase.storageUrl}/object/public/mbus_bucket/`, '');

            const { data: fileExists, error: checkError } = await supabase
                .storage
                .from('mbus_bucket')
                .list('', { prefix: filePath });

            if (checkError) {
                console.error(`Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`);
            } else if (fileExists && fileExists.length > 0) {
                const { error: deleteError } = await supabase
                    .storage
                    .from('mbus_bucket')
                    .remove([filePath]);

                if (deleteError) {
                    throw new Error(`Faylni o'chirishda xatolik: ${deleteError.message}`);
                }
            }
        }

        await driverModel.findByIdAndDelete(id);

        return res.redirect('/drivers')
    } catch (error) {
        console.error(error);
        return res.redirect('/500')
    }
}