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
    status: {
        isString: {
            errorMessage: "Status string bo'lishi kerak",
        },
        notEmpty: { errorMessage: "Status talab qilinadi!" },
    },
    seatsCount: {
        isInt: {
            errorMessage: "O'rindiqlar soni raqam bo'lishi shart!"
        },
        notEmpty: {
            errorMessage: "O'rindiqlar soni talab qilinadi!"
        }
    }
    // image: {
    //     custom: {
    //         options: async (value, { req }) => {
    //             const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg', 'image/webp'];
    //             if (req.file) {
    //                 const fileType = await fromBuffer(req.file.buffer)

    //                 if (!fileType || !validMimeTypes.includes(fileType.mime)) {
    //                     throw new Error('Image must be only JPEG, JPG, PNG, SVG, WEBP format!');
    //                 }
    //             }
    //             return true;
    //         },
    //     },
    // }
};
