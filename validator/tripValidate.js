exports.createTripSchema = ({
    route: {
        notEmpty: {
            errorMessage: "Yo'nalish kiritilishi shart!"
        }
    },
    bus: {
        notEmpty: {
            errorMessage: "Avtobus kiritilishi shart!"
        }
    },
    departure_date: {
        isString: {
            errorMessage: "Ketish kuni stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Ketish kuni kiritilishi shart!"
        },
        isISO8601: {
            errorMessage: "Ketish kuni YYYY-MM-DD formatida bo‘lishi kerak!"
        }
    },
    departure_time: {
        isString: {
            errorMessage: "Ketish vaqti stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Ketish vaqti kiritilishi shart!"
        },
        matches: {
            options: [/^([01]\d|2[0-3]):([0-5]\d)$/],
            errorMessage: "Ketish vaqti HH:mm formatida bo‘lishi kerak!"
        }
    },
    arrival_date: {
        isString: {
            errorMessage: "Kelish kuni stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Kelish kuni kiritilishi shart!"
        },
        isISO8601: {
            errorMessage: "Kelish kuni YYYY-MM-DD formatida bo‘lishi kerak!"
        }
    },
    arrival_time: {
        isString: {
            errorMessage: "Kelish vaqti stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Kelish vaqti kiritilishi shart!"
        },
        matches: {
            options: [/^([01]\d|2[0-3]):([0-5]\d)$/],
            errorMessage: "Kelish vaqti HH:mm formatida bo‘lishi kerak!"
        }
    },
    ticket_price: {
        notEmpty: {
            errorMessage: "Chipta narxi kiritilishi shart!"
        },
        isInt: {
            options: { min: 50000 },
            errorMessage: "Chipta narxi kamida 50000 so'm bo'lishi kerak!"
        }
    }
});
