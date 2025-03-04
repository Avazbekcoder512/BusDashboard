const mongoose = require("mongoose")
require("dotenv").config()

exports.Connect = async () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log("Mongodb muvaffaqiyatli ulandi!"))
        .catch((error) => console.log(error))

}