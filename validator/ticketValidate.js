exports.createTicketSchema = {
    passenger: {
        notEmpty: {
            errorMessage: "Yo‘lovchi ismi bo‘lishi shart!"
        },
        isString: {
            errorMessage: "Yo‘lovchi ismi matn ko‘rinishida bo‘lishi kerak!"
        }
    },
    birthday: {
        notEmpty: {
            errorMessage: "Yo‘lovchi tu'gilgan yili bo‘lishi shart!"
        },
        isString: {
            errorMessage: "Yo‘lovchi tu'gilgan yili sana ko'rinishida bo‘lishi kerak!"
        },
        custom: {
            options: (value) => {
                const birthday = new Date(value);
                const today = new Date();
                const maxDate = new Date();
                maxDate.setFullYear(today.getFullYear() - 110);

                if (isNaN(birthday.getTime())) {
                    throw new Error("Sana noto‘g‘ri formatda!");
                }

                if (birthday > today) {
                    throw new Error("Tug‘ilgan sana kelajakdagi sana bo‘lishi mumkin emas!");
                }

                if (birthday < maxDate) {
                    throw new Error("Tug‘ilgan sana 110 yildan oldin bo‘lishi mumkin emas!");
                }

                return true;
            }
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
        isMobilePhone: {
            options: ["uz-UZ"],
            errorMessage: "Telefon raqamini to'g'ri formatda kiriting! (masalan, +998901234567)"
        },
        matches: {
            options: [/^(\+998)(99|98|97|95|93|91|90|33|77|88)\d{7}$/],
            errorMessage: "Telefon raqami noto'g'ri kiritilgan, iltimos, to'g'ri formatda kiriting!"
        }
    }
}