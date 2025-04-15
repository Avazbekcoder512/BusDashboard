exports.stationCreateSchema = {
    name: {
        isString: {
            errorMessage: "Bekat nomi string bo'lishi kerak!"
        },
        notEmpty: {
            errorMessage: "Bekat nomi bo'sh bo'lmasligi kerak!"
        }
    }
}