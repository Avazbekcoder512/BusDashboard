const { validationResult, matchedData } = require("express-validator");
const ticketSellerModel = require("../models/ticket_seller");
const { createClient } = require("@supabase/supabase-js");
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');

const supabase = createClient(
    process.env.Supabase_Url,
    process.env.Anon_key
)

exports.createTicketSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/ticketsellers');
        }
        const data = matchedData(req);

        const condidat = await ticketSellerModel.findOne({ username: data.username })

        if (condidat) {
            req.flash('error', "Bunday usernamega ega foydalanuvchi allaqchon ro'yhatdan o'tgan!")
            return res.redirect('/ticketsellers');
        }

        if (!req.file) {
            req.flash('error', 'Iltimos, rasm faylni yuklang!')
            return res.redirect('/ticketsellers');
        }

        const maxFileSize = 5 * 1024 * 1024;
        if (req.file.size > maxFileSize) {
            req.flash('error', 'Rasm hajmi 5 MB dan oshmasligi kerak!')
            return res.redirect('/ticketsellers')
        }

        const { buffer, originalname } = req.file;
        const fileName = `ticketSellers/${Date.now()}-${originalname}`;

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

        const ticketSeller = await ticketSellerModel.create({
            name: data.name,
            username: data.username,
            password: passwordHash,
            phoneNumber: data.phoneNumber,
            gender: data.gender,
            image: fileUrl
        })

        // return res.status(201).send({
        //     message: "Chiptachi muvaffaqiyatli yaratildi!",
        //     ticketSeller
        // })

        return res.redirect('/ticketsellers')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getAllTicketSellers = async (req, res) => {
    try {
        const ticketSellers = await ticketSellerModel.find()
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const admin = jwt.verify(token, process.env.JWT_KEY)

        return res.render('ticketsellers', {
            ticketSellers,
            title: "Chiptachilar ro'yxati",
            token,
            gender,
            admin,
            errorFlash: req.flash('error')
        })

        // return res.status(200).send({
        //     ticketSellers
        // })
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.getOneTicketSeller = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const ticketSeller = await ticketSellerModel.findById(id)

        if (!ticketSeller) {
            return res.status(404).send({
                error: "Chiptachi topilmadi!"
            })
        }
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.updateTicketSeller = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/ticketsellers')
        }

        const ticketSeller = await ticketSellerModel.findById(id)

        if (!ticketSeller) {
            req.flash('error', 'Chiptachi topilmadi!')
            return res.redirect('/ticketsellers')
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', errors.array().map(error => error.msg).join("<br>"));
            return res.redirect('/ticketsellers');
        }
        const data = matchedData(req);

        let fileUrl = ticketSeller.image;

        if (req.file) {
            try {
                const maxFileSize = 5 * 1024 * 1024;
                if (req.file.size > maxFileSize) {
                    req.flash('error', 'Rasm hajmi 5 MB dan oshmasligi kerak!')
                    return res.redirect('/ticketsellers')
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

        const newTicketSeller = {
            name: data.name || ticketSeller.name,
            username: data.username || ticketSeller.username,
            phoneNumber: data.phoneNumber || ticketSeller.phoneNumber,
            gender: data.gender || ticketSeller.gender,
            image: fileUrl || ticketSeller.image
        }

        await ticketSellerModel.findByIdAndUpdate(id, newTicketSeller)

        // return res.status(201).send({
        //     message: "Chiptachinimg ma'lumotlari muvaffaqiyatli yangilandi!"
        // })

        return res.redirect('/ticketsellers')
    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}

exports.deleteTicketSeller = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            req.flash('error', "Id noto'g'ri")
            return res.redirect('/ticketsellers')
        }

        const ticketSeller = await ticketSellerModel.findById(id)

        if (!ticketSeller) {
            req.flash('error', 'Chiptachi topilmadi!')
            return res.redirect('/ticketsellers')
        }

        let fileUrl = ticketSeller.image;

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

        await ticketSellerModel.findByIdAndDelete(id)

        // return res.status(200).send({
        //     message: "Chiptachi muvaffaqiyatli o'chirildi!"
        // })

        return res.redirect('/ticketsellers')

    } catch (error) {
        console.log(error);
        return res.redirect('/500')
    }
}