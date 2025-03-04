const express = require('express')
const { Connect } = require('./database/connect')
const app = express()
require("dotenv").config()

Connect()




const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server ${PORT}-Portda ishga tushdi...`);
})