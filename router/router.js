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
const { createTrip, getAllTrips, getOneTrip, deleteTrip, updateTrip } = require("../controller/tripController")
const { getAllDrivers, createDriver, updateDriver, deleteDriver } = require("../controller/driverController")
const { createDriverSchema, updateDriverSchema } = require("../validator/driverValidate")
const { createTicketSeller, getAllTicketSellers, getOneTicketSeller, updateTicketSeller, deleteTicketSeller } = require("../controller/ticketSellerController")
const { createTicketSellerSchema, updateTicketSellerSchema } = require("../validator/ticketSellerValidate")
const { jwtAccessMiddleware } = require("../middleware/jwt-accessMiddleware")
const upload = multer()

const router = require("express").Router()

router
// login router
.get('/login', loginPage)
.post('/login', checkSchema(loginValidate), login)
.get('/logout', logout)

// Admin router
.get("/", jwtAccessMiddleware, getAllAdmin)
.post('/create-admin', jwtAccessMiddleware, upload.single("image"), checkSchema(createAdminSchema), createAdmin)
.post('/admin/:id/delete', jwtAccessMiddleware, deleteAdmin)

// Bus router
.post('/create-bus', jwtAccessMiddleware, upload.single("image"), checkSchema(createBusSchema), createBus)
.get('/buses', jwtAccessMiddleware, getAllBuses)
.get('/bus/:id', jwtAccessMiddleware, getOneBus)
.post('/bus/:id/update', jwtAccessMiddleware, upload.single('image'), checkSchema(updateBusSchema), updateOneBus)
.post('/bus/:id/delete', jwtAccessMiddleware, deleteOneBus)

// Route router
.post('/create-route', jwtAccessMiddleware, checkSchema(createRouteSchema), createRoute)
.get('/routes', jwtAccessMiddleware, getAllRoutes)
.get('/route/:id', jwtAccessMiddleware, getOneRoutes)
.post('/route/:id/update', jwtAccessMiddleware, checkSchema(updateRouteSchema), updateRoute)
.post('/route/:id/delete', jwtAccessMiddleware, deleteRoute)

// Trip router
.post('/create-trip', jwtAccessMiddleware, checkSchema(createTripSchema), createTrip)
.get('/trips', jwtAccessMiddleware, getAllTrips)
.get('/trip/:id', jwtAccessMiddleware, getOneTrip)
.post('/trip/:id/delete', jwtAccessMiddleware, updateTrip)
.post('/trip/:id/delete', jwtAccessMiddleware, deleteTrip)

// Driver router
.post('/create-driver', jwtAccessMiddleware, upload.single("image"), checkSchema(createDriverSchema), createDriver)
.get('/drivers', jwtAccessMiddleware, getAllDrivers)
.post('/driver/:id/update', jwtAccessMiddleware, upload.single('image'), checkSchema(updateDriverSchema), updateDriver)
.post('/driver/:id/delete', jwtAccessMiddleware, deleteDriver)

// TicketSeller router
.post('/create-ticketseller', jwtAccessMiddleware, upload.single('image'), checkSchema(createTicketSellerSchema), createTicketSeller)
.get('/ticketsellers', jwtAccessMiddleware, getAllTicketSellers)
.get('/ticketseller/:id', jwtAccessMiddleware, getOneTicketSeller)
.post('/ticketseller/:id/update', jwtAccessMiddleware, upload.single('image'), checkSchema(updateTicketSellerSchema), updateTicketSeller)
.post('/ticketseller/:id/delete', jwtAccessMiddleware, deleteTicketSeller)

module.exports = router