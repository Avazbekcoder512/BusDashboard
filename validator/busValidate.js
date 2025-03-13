const { fromBuffer } = require("file-type");

exports.createBusSchema = {
    model: {
        isString: {
            errorMessage: "Avtobus modeli string bo'lishi shart!",
        },
        notEmpty: {
            errorMessage: "Avtobus modeli talab qilinadi!",
        },
    },
    number: {
        isString: {
            errorMessage: "Avtobus raqami string bo'lishi kerak"
        },
        isLength: {
            options: {min: 8, max: 8},
            errorMessage: "Avtobus raqami 8 ta belgidan kam bo'lmasligi va oshib ketmasligi kerak!"
        }
    },
    // status: {
    //     isString: {
    //         errorMessage: "Status string bo'lishi kerak",
    //     },
    // },
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
    // route: {
    //     isString: {
    //         errorMessage: "Avtobus modeli string bo'lishi shart!",
    //     },
    //     notEmpty: {
    //         errorMessage: "Avtobus modeli talab qilinadi!",
    //     },
    // }
};

exports.updateBusSchema = {
    model: {
        isString: {
            errorMessage: "Avtobus modeli string bo'lishi shart!",
        },
    },
    status: {
        isString: {
            errorMessage: "Status string bo'lishi kerak",
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