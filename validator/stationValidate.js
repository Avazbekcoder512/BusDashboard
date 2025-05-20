exports.stationCreateSchema = {
    uz_name: {
        isString: {
            errorMessage: "Bekat nomi string bo'lishi kerak!"
        },
        notEmpty: {
            errorMessage: "Bekat nomi bo'sh bo'lmasligi kerak!"
        }
    },
    ru_name: {
        isString: {
            errorMessage: "Bekat nomi string bo'lishi kerak!"
        },
        notEmpty: {
            errorMessage: "Bekat nomi bo'sh bo'lmasligi kerak!"
        }
    },
    en_name: {
        isString: {
            errorMessage: "Bekat nomi string bo'lishi kerak!"
        },
        notEmpty: {
            errorMessage: "Bekat nomi bo'sh bo'lmasligi kerak!"
        }
    }
}