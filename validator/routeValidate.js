exports.createRouteSchema = {
    name: {
        isString: {
            errorMessage: "Yon'alish nomi stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Yo'nalish nomi kiritilishi shart!"
        }
    },
    from: {
        isString: {
            errorMessage: "Boshlang'ich manzil stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Boshlang'ich manzil kiritilishi shart!"
        }
    },
    to: {
        isString: {
            errorMessage: "Yakuniy manzil stringda kiritilishi shart!",
        },
        notEmpty: {
            errorMessage: "Yakuniy manzil kiritilishi shart!"
        }
    }
};

exports.updateRouteSchema = {
    name: {
        isString: {
            errorMessage: "Yon'alish nomi stringda kiritilishi shart!",
        }
    },
    from: {
        isString: {
            errorMessage: "Boshlang'ich manzil stringda kiritilishi shart!",
        },
    },
    to: {
        isString: {
            errorMessage: "Yakuniy manzil stringda kiritilishi shart!",
        }
    }
}