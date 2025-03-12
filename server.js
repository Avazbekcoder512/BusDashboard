const express = require('express')
const { Connect } = require('./database/connect')
require("dotenv").config()
const Handlebars = require('handlebars')
const { create } = require('express-handlebars')
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const router = require('./router/router')
const cors = require('cors')

Connect()
const hbs = create({ defaultLayout: "main", extname: "hbs", handlebars: allowInsecurePrototypeAccess(Handlebars) })

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
app.engine("hbs", hbs.engine)
app.set("view engine", "hbs")
app.set("views", "./public/views")
app.use(cors())
app.use('/', router)
app.use(express.static("public"))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({ secret: "Admin", resave: false, saveUninitialized: false, }))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server ishga tushdi...`);
})