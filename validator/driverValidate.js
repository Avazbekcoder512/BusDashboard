const { fromBuffer } = require("file-type");

exports.createDriverSchema = {
    name: {
        isString: {
            errorMessage: "Ismni stingda kiriting!"
        },
        notEmpty: {
            errorMessage: "Ismni kirish shart!"
        }
    },
    experience: {
        isInt: {
            options: { min: 1, max: 50 },
            errorMessage: "Tajribani raqamda kiriting, Tajriba 1 yildan kam 50 yildan ko'p bo'lmasligi kerak!"
        }
    },
    phoneNumber: {
        isMobilePhone: {
            options: ["uz-UZ"],
            errorMessage: "Telefon raqamini to'g'ri formatda kiriting! (masalan, +998901234567)"
        },
        notEmpty: {
            errorMessage: "Telefon raqamini kiritish shart!"
        }
    },
    gender: {
        isString: {
            errorMessage: "Jinsi string bo'lishi kerak",
        },
        notEmpty: { errorMessage: "Jinsi talab qilinadi!" },
        isIn: {
            options: [["Erkak", "Ayol"]],
            errorMessage: "Faqat Erkak yoki Ayol kiritish mumkin",
        },
    },
    bus: {
        notEmpty: {
            errorMessage: "Avtobus idisini kiritish shart!"
        }
    },
    image: {
        custom: {
            options: async (value, { req }) => {
                const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/webp'];
                if (req.file) {
                    const fileType = await fromBuffer(req.file.buffer)

                    if (!fileType || !validMimeTypes.includes(fileType.mime)) {
                        throw new Error('Image must be only JPEG, JPG, PNG, SVG, WEBP format!');
                    }
                }
                return true;
            },
        },
    }
}