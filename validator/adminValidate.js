const { fromBuffer } = require("file-type");

exports.createAdminSchema = {
    name: {
        isString: {
            errorMessage: "Ism string bo'lishi kerak",
        },
        notEmpty: {
            errorMessage: "Ism talab qilinadi!",
        },
    },
    username: {
        isString: {
            errorMessage: "Username string bo'lishi kerak",
        },
        notEmpty: { errorMessage: "Username talab qilinadi!" },
    },
    password: {
        isString: {
            errorMessage: "Parol string bo'lishi kerak",
        },
        notEmpty: {
            errorMessage: "Parol talab qilinadi!",
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Parol kamida 8 ta belgidan iborad bo'lishi kerak",
        },
        trim: {
            errorMessage: "Parolning belgilari orasi ochiq bo'lmasligi kerak!"
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
    role: {
        isString: {
            errorMessage: "Username string bo'lishi kerak",
        },
        notEmpty: { errorMessage: "Username talab qilinadi!" },
        isIn: {
            options: [["admin", "superAdmin"]],
            errorMessage: "Faqat admin yoki superAdmin kiritish mumkin",
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
};
