const express = require('express');
const { Connect } = require('./database/connect');
require("dotenv").config();
const Handlebars = require('handlebars');
const { create } = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require('connect-flash')
const router = require('./router/router');
const cors = require('cors');
const { createWeeklyRoutes, deleteOldRoutes } = require('./middleware/cronjobMiddleware');

Connect();

const hbs = create({
    defaultLayout: "main",
    extname: "hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers: {
        eq: function (a, b, c) {
            return a === b || a === c;
        }
    }
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./public/views");

createWeeklyRoutes()
deleteOldRoutes()

app.use(session({ secret: "Admin", resave: false, saveUninitialized: false }));
app.use(flash())
app.use('/', router);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server ishga tushdi...`);
});
