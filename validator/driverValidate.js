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
    username: {
        notEmpty: {
            errorMessage: "Usernameni kiritish majburiy!"
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
    experience: {
        isInt: {
            options: { min: 1, max: 50 },
            errorMessage: "Tajribani raqamda kiriting, Tajriba 1 yildan kam 50 yildan ko'p bo'lmasligi kerak!"
        }
    },
    phoneNumber: {
        matches: {
            options: [/^(\+998)(99|98|97|95|93|91|90|33|77|88)\d{7}$/],
            errorMessage: "Telefon raqami noto'g'ri kiritilgan, iltimos, to'g'ri formatda kiriting!"
        },
        notEmpty: {
            errorMessage: 'Telefon raqamni kiriting!'
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

exports.updateDriverSchema = {
    name: {
        isString: {
            errorMessage: "Ismni stingda kiriting!"
        }
    },
    username: {
        notEmpty: {
            errorMessage: "Usernameni kiritish majburiy!"
        }
    },
    experience: {
        isInt: {
            options: { min: 1, max: 50 },
            errorMessage: "Tajribani raqamda kiriting, Tajriba 1 yildan kam 50 yildan ko'p bo'lmasligi kerak!"
        }
    },
    phoneNumber: {
        matches: {
            options: [/^(\+998)(99|98|97|95|93|91|90|33|77|88)\d{7}$/],
            errorMessage: "Telefon raqami noto'g'ri kiritilgan, iltimos, to'g'ri formatda kiriting!"
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