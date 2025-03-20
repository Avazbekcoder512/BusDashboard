exports.createTripSchema = {
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
        }
    },
    departure_time: {
        isString: {
            errorMessage: "Ketish vaqti stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Ketish vaqti kiritilishi shart!"
        }
    },
    arrival_date: {
        isString: {
            errorMessage: "Kelish kuni stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Kelish kuni kiritilishi shart!"
        }
    },
    arrival_time: {
        isString: {
            errorMessage: "Kelish vaqti stringda kiritilishi kerak!"
        },
        notEmpty: {
            errorMessage: "Kelish vaqti kiritilishi shart!"
        }
    },
    ticket_price: {
        isInt: {
            options: { min: 50000 },
            errorMessage: "Chipta narxi kamida 50000 so'm bo'lishi kerak!"
        }
    }
}