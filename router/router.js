const { checkSchema } = require("express-validator")
const { getAllAdmin, createAdmin, deleteAdmin } = require("../controller/adminController")
const { createAdminSchema } = require("../validator/adminValidate")
const { login, loginPage, logout } = require("../controller/authController")
const { loginValidate } = require("../validator/authValidate")
const multer = require('multer')
const { createBusSchema, updateBusSchema } = require("../validator/busValidate")
const { createBus, getOneBus, getAllBuses, updateOneBus, deleteOneBus } = require("../controller/busContoller")
const { createRouteSchema, updateRouteSchema } = require("../validator/routeValidate")
const { createRoute, getAllRoutes, getOneRoutes, updateRoute, deleteRoute } = require("../controller/routeController")
const { createTripSchema } = require("../validator/tripValidate")
const { createTrip, getAllTrips, getOneTrip } = require("../controller/tripController")
const { getAllDrivers, createDriver } = require("../controller/driverController")
const { createDriverSchema } = require("../validator/driverValidate")
const upload = multer()

const router = require("express").Router()

router
// login router
.get('/login', loginPage)
.post('/login', checkSchema(loginValidate), login)
.get('/logout', logout)

// Admin router
.get("/", getAllAdmin)
.post('/create-admin', upload.single("image"), checkSchema(createAdminSchema), createAdmin)
.post('/admin/:id/delete', deleteAdmin)

// Bus router
.post('/create-bus', upload.single("image"), checkSchema(createBusSchema), createBus)
.get('/buses', getAllBuses)
.get('/bus/:id', getOneBus)
.post('/bus/:id/update',upload.single('image'), checkSchema(updateBusSchema), updateOneBus)
.post('/bus/:id/delete', deleteOneBus)

// Route router
.post('/create-route', checkSchema(createRouteSchema), createRoute)
.get('/routes', getAllRoutes)
.get('/route/:id', getOneRoutes)
.post('/route/:id/update', checkSchema(updateRouteSchema), updateRoute)
.post('/route/:id/delete', deleteRoute)

// Trip router
.post('/create-trip', checkSchema(createTripSchema), createTrip)
.get('/trips', getAllTrips)
.get('/trip/:id', getOneTrip)

// Driver router
.post('/create-driver', upload.single("image"), checkSchema(createDriverSchema), createDriver)
.get('/drivers', getAllDrivers)

module.exports = router