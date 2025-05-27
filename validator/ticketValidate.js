exports.createTicketSchema = {
    passenger: {
        notEmpty: {
            errorMessage: "Yo‘lovchi ismi bo‘lishi shart!"
        },
        isString: {
            errorMessage: "Yo‘lovchi ismi matn ko‘rinishida bo‘lishi kerak!"
        }
    },
    gender: {
        notEmpty: {
            errorMessage: "Yo‘lovchi jinsini kiritishi shart!"
        },
        isString: {
            errorMessage: "Yo‘lovchi jinsini matn ko'rinishida kiritishi shart!"
        },
        isIn: {
            options: [["male", "female"]],
            errorMessage: "Faqat Erkak yoki Ayol kiritish mumkin",
        }
    },
    passport: {
        notEmpty: {
            errorMessage: "Yo‘lovchi passport raqami bo‘lishi shart!"
        },
        isString: {
            errorMessage: "Yo‘lovchi passport raqami matn ko'rinishida bo‘lishi kerak!"
        }
    },
    phoneNumber: {
        notEmpty: {
            errorMessage: "Yo‘lovchi telefon raqami bo‘lishi shart!"
        },
        matches: {
            options: [/^(\+998)(99|98|97|95|93|91|90|33|77|88)\d{7}$/],
            errorMessage: "Telefon raqami noto'g'ri kiritilgan, iltimos, to'g'ri formatda kiriting!"
        }
    }
}