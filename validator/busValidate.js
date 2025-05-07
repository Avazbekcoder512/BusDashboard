const { fromBuffer } = require("file-type");

exports.createBusSchema = {
    bus_model: {
        isString: {
            errorMessage: "Avtobus modeli string bo'lishi shart!",
        },
        notEmpty: {
            errorMessage: "Avtobus modeli talab qilinadi!",
        },
    },
    bus_number: {
        isString: {
            errorMessage: "Avtobus raqami string bo'lishi kerak"
        },
        isLength: {
            options: { min: 8, max: 8 },
            errorMessage: "Avtobus raqami 8 ta belgidan kam bo'lmasligi va oshib ketmasligi kerak!"
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
};

exports.updateBusSchema = {
    bus_model: {
        isString: {
            errorMessage: "Avtobus modeli string bo'lishi shart!",
        }
    },
    bus_number: {
        isString: {
            errorMessage: "Avtobus raqami string bo'lishi kerak"
        },
        isLength: {
            options: { min: 8, max: 8 },
            errorMessage: "Avtobus raqami 8 ta belgidan kam bo'lmasligi va oshib ketmasligi kerak!"
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
};