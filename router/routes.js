const { checkSchema } = require("express-validator")
const { getAllAdmin, createAdmin, deleteAdmin } = require("../controller/adminController")
const { createAdminSchema } = require("../validator/adminValidate")
const { login, loginPage } = require("../controller/authController")
const { loginValidate } = require("../validator/authValidate")
const multer = require('multer')
const upload = multer()

const router = require("express").Router()

router

.get('/login', loginPage)
.post('/login', checkSchema(loginValidate), login)

// Admin router
.get("/", getAllAdmin)
.post('/create-admin', upload.single("image"), checkSchema(createAdminSchema), createAdmin)
.post('/admin/:id/delete', deleteAdmin)


module.exports = router