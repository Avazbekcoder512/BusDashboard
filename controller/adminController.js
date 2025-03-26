const { matchedData, validationResult } = require("express-validator");
const adminModel = require("../models/admin");
const bcrypt = require('bcrypt');
const { createClient } = require("@supabase/supabase-js");
const jwt = require('jsonwebtoken')
require("dotenv").config()

const supabase = createClient(
    process.env.Supabase_Url,
    process.env.Anon_key,
);

exports.createAdmin = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg),
            });
        }
        const data = matchedData(req);


        const condidat = await adminModel.findOne({ username: data.username })
        if (condidat) {
            return res.status(400).send({
                error: "Bunday username allaqachon ro'yhatdan o'tgan!"
            })
        }

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
        const fileName = `admins/${Date.now()}-${originalname}`;

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

        const admin = await adminModel.create({
            name: data.name,
            username: data.username,
            password: passwordHash,
            role: data.role,
            gender: data.gender,
            image: fileUrl
        })

        return res.redirect('/')
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.getAllAdmin = async (req, res) => {
    try {
        const token = req.cookies.authToken
        const gender = req.cookies.gender
        const user = jwt.verify(token, process.env.JWT_KEY)
        if (!token) {
            return res.redirect('/login')
        }
        const admins = await adminModel.find()

        if (admins.length == 0) {
            return res.status(404).send({
                error: "Adminlar mavjud emas!"
            })
        }

        return res.render("admins", {
            title: "Dashboard",
            admins,
            token,
            gender,
            user
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const admin = await adminModel.findById(id);
        if (!admin) {
            return res.status(404).send({
                error: "Admin not found!"
            });
        }

        const fileUrl = admin.image

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

        await adminModel.findByIdAndDelete(id);

        return res.redirect('/')
    } catch (error) {
        console.error(error);
        return res.status(500).send({
            error: error.message || "An error occurred while deleting the admin!"
        });
    }
}