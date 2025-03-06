exports.loginValidate = {
    username: {
        isString: {
            errorMessage: "Username string bo'lishi kerak"
        },
        notEmpty: { errorMessage: "Username talab qilinadi!" }
    },
    password: {
        isString: {
            errorMessage: "Parol string bo'lishi kerak"
        },
        notEmpty: {
            errorMessage: "Parol talab qilinadi!"
        },
        isLength: {
            options: { min: 8 },
            errorMessage: "Parol kamida 8 ta belgidan iborad bo'lishi kerak"
        }
    }
}