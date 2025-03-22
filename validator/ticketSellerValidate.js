const { fromBuffer } = require("file-type");

exports.createTicketSellerSchema = {
    name: {
        notEmpty: {
            errorMessage: "Ismni kiritish majburiy!"
        }
    },
    username: {
        notEmpty: {
            errorMessage: "Username kiritsh majburiy!"
        }
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: "Parol kamida 8 ta belgidan iborat bo'lishi kerak!"
        },
        trim: {
            errorMessage: "Parolning belgilari orasi ochiq bo'lmasligi kerak!"
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
        notEmpty: "Avtobusni kiritish majburiy!"
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

exports.updateTicketSellerSchema = {
    name: {
        notEmpty: {
            errorMessage: "Ismni kiritish majburiy!"
        }
    },
    username: {
        notEmpty: {
            errorMessage: "Username kiritsh majburiy!"
        }
    },
    bus: {
        notEmpty: "Avtobusni kiritish majburiy!"
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