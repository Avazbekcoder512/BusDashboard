const { validationResult, matchedData } = require("express-validator");
const busModel = require("../models/bus");
const { createClient } = require("@supabase/supabase-js");
const seatModel = require("../models/seat");
const routeModel = require("../models/route");
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
        // const fileName = `buses/${Date.now()}-${originalname}`;

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
            number: data.number,
            seats_count: data.seats_count,
            // image: fileUrl,
            seats: [],
        })

        const seatsCount = data.seats_count

        let seats = [];
        for (let i = 1; i <= seatsCount; i++) {
            let seat = new seatModel({ seetNumber: i, bus: bus._id });
            await seat.save();
            seats.push(seat._id);
        }

        bus.seats = seats;
        await bus.save();

        return res.status(201).send({
            message: "Avtobus muvaffaqiyatli yaratildi!",
            bus: bus
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
        const buses = await busModel.find().populate('seats')
        const route = await routeModel.find()
        const token = req.cookies.authToken

        if (!buses.length) {
            return res.status(404).send({
                error: "Avtobuslar topilmadi!"
            })
        }

        if (!route.length) {
            return res.status(404).send({
                error: "Yo'nalish topilmadi!"
            })
        }

        return res.status(200).send({
            buses
        })

        // return res.render('buses', {
        //     title: "Avtobuslar",
        //     buses,
        //     token,
        //     route
        // })
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

exports.updateOneBus = async (req, res) => {
    try {
        const { id } = req.params

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const bus = await busModel.findById(id)

        if (!bus) {
            return res.status(404).send({
                error: "Avtobus topilmadi!"
            })
        }

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).send({
                error: errors.array().map((error) => error.msg)
            })
        }

        const data = matchedData(req)

        // let fileUrl = bus.image;
        // if (req.file) {
        //     try {
        //         const maxFileSize = 5 * 1024 * 1024;
        //         if (req.file.size > maxFileSize) {
        //             return res.status(400).send({
        //                 error: "Rasm hajmi 5 MB dan oshmasligi kerak!",
        //             });
        //         }

        //         if (fileUrl) {
        //             const filePath = fileUrl.replace(
        //                 `${supabase.storageUrl}/object/public/mbus_bucket/`,
        //                 ""
        //             );

        //             const { data: fileExists, error: checkError } = await supabase.storage
        //                 .from("mbus_bucket")
        //                 .list("", { prefix: filePath });

        //             if (checkError) {
        //                 console.error(
        //                     `Fayl mavjudligini tekshirishda xatolik: ${checkError.message}`
        //                 );
        //             } else if (fileExists && fileExists.length > 0) {
        //                 const { error: deleteError } = await supabase.storage
        //                     .from("mbus_bucket")
        //                     .remove([filePath]);

        //                 if (deleteError) {
        //                     throw new Error(
        //                         `Faylni o'chirishda xatolik: ${deleteError.message}`
        //                     );
        //                 }
        //             }
        //         }

        //         const { buffer, originalname } = req.file;
        //         const fileName = `buses/${Date.now()}-${originalname}`;
        //         const { data: uploadData, error: uploadError } = await supabase.storage
        //             .from("mbus_bucket")
        //             .upload(fileName, buffer, {
        //                 cacheControl: "3600",
        //                 upsert: true,
        //                 contentType: req.file.mimetype,
        //             });

        //         if (uploadError) {
        //             throw new Error(`Fayl yuklanmadi: ${uploadError.message}`);
        //         }

        //         fileUrl = `${supabase.storageUrl}/object/public/mbus_bucket/${fileName}`;
        //     } catch (err) {
        //         console.error(`Faylni yangilashda xatolik: ${err.message}`);
        //         throw new Error(
        //             "Yangi faylni yuklash yoki eski faylni o‘chirishda muammo!"
        //         );
        //     }
        // }


        const updateBus = {
            bus_number: data.bus_number || bus.bus_number,
            bus_model: data.bus_model || bus.bus_model,
            seats_count: data.seats_count || bus.seats_count
            // image: fileUrl || bus.image
        }

        await busModel.findByIdAndUpdate(id, updateBus, { new: true })

        return res.status(200).send({
            message: "Avtobus muvaffaqiyatli yangilandi!"
        })
    } catch (error) {
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}

exports.deleteOneBus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).send({
                error: "Invalid ID format!"
            });
        }

        const bus = await busModel.findById(id);
        if (!bus) {
            return res.status(404).send({
                error: "Avtobus topilmadi!"
            });
        }

        const fileUrl = bus.image

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

        await busModel.findByIdAndDelete(id);

        return res.status(200).send({
            message: "Admin deleted successfully!"
        });
    } catch (error) {
        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}