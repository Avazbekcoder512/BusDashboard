exports.createRouteSchema = {
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
    departure_time: {
        notEmpty: {
            errorMessage: "Jo'nash vaqtini kiritish shart!"
        }
    },
    arrival_time: {
        notEmpty: {
            errorMessage: "Yetib borish vaqti kiritish shart!"
        }
    },
    departure_date: {
        isString: {
            errorMessage: "Reysning jo'nash sanasini stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Reysning jo'nash sanasi kiritish shart!"
        }
    },
    arrival_date: {
        isString: {
            errorMessage: "Reysning yetib borish sanasini stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Reysning yetib borish sanasi kiritish shart!"
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
    bus_id: {
        custom: {
            options: async (value, { req }) => {
                if (!value || !value.match(/^[0-9a-fA-F]{24}$/)) {
                    throw new Error("Avtobus ID xato!");
                }
                return true;
            },
        }
    }
};