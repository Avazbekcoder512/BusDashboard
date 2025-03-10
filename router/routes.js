const { checkSchema } = require("express-validator")
const { getAllAdmin, createAdmin, deleteAdmin } = require("../controller/adminController")
const { createAdminSchema } = require("../validator/adminValidate")
const { login, loginPage } = require("../controller/authController")
const { loginValidate } = require("../validator/authValidate")
const multer = require('multer')
const { createBusSchema, updateBusSchema } = require("../validator/busValidate")
const { createBus, getOneBus, getAllBuses, updateOneBus, deleteOneBus } = require("../controller/busContoller")
const upload = multer()

const router = require("express").Router()

router
// login router
.get('/login', loginPage)
.post('/login', checkSchema(loginValidate), login)

// Admin router
.get("/", getAllAdmin)
.post('/create-admin', upload.single("image"), checkSchema(createAdminSchema), createAdmin)
.post('/admin/:id/delete', deleteAdmin)

// Bus router
.post('/create-bus', checkSchema(createBusSchema), createBus)
.get('/buses', getAllBuses)
.get('/bus/:id', getOneBus)
.post('/bus/:id/update', checkSchema(updateBusSchema), updateOneBus)
.post('/bus/:id/delete', deleteOneBus)


module.exports = router