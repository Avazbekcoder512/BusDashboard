exports.createRouteSchema = {
    name: {
        isString: {
            errorMessage: "Yo'nalish nomi stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Yo'nalish nomini kiritish shart!",
        },
    },
    from: {
        isString: {
            errorMessage: "Boshlang'ich manzil stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Boshlang'ich manzilni kiritish shart!"
        }
    },
    to: {
        isString: {
            errorMessage: "Yakuniy manzil stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Yakuniy manzilni kiritish shart!"
        }
    },
    // time: {
    //     matches: {
    //         options: [/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/],
    //         errorMessage: "Vaqt noto'g'ri formatda!"
    //     },
    //     notEmpty: {
    //         errorMessage: "Vaqtni kiritish shart!"
    //     }
    // }
    departure_time: {
        notEmpty: {
            errorMessage: "Yakuniy manzilni kiritish shart!"
        }
    },
    arrival_time: {
        notEmpty: {
            errorMessage: "Yakuniy manzilni kiritish shart!"
        }
    },
    price: {
        isInt: {
            options: { min: 0 },
            errorMessage: "Narxni raqamda kiriting!"
        },
        notEmpty: {
            errorMessage: "Narxi kiritish shart!"
        }
    },
    distance: {
        isInt: {
            options: { min: 0 },
            errorMessage: "Masofani raqamda kiriting!"
        },
        notEmpty: {
            errorMessage: "Masofani kiritish shart!"
        }
    }
};