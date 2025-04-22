const { checkSchema } = require("express-validator")
const { getAllAdmin, createAdmin, deleteAdmin } = require("../controller/adminController")
const { createAdminSchema } = require("../validator/adminValidate")
const { login, loginPage, logout } = require("../controller/authController")
const { loginValidate } = require("../validator/authValidate")
const multer = require('multer')
const { createBusSchema, updateBusSchema } = require("../validator/busValidate")
const { createBus, getOneBus, getAllBuses, updateOneBus, deleteOneBus } = require("../controller/busController")
const { createRouteSchema, updateRouteSchema } = require("../validator/routeValidate")
const { createRoute, getAllRoutes, getOneRoutes, updateRoute, deleteRoute } = require("../controller/routeController")
const { createTripSchema, updateTripSchema } = require("../validator/tripValidate")
const { createTrip, getAllTrips, getOneTrip, deleteTrip, updateTrip } = require("../controller/tripController")
const { getAllDrivers, createDriver, updateDriver, deleteDriver } = require("../controller/driverController")
const { createDriverSchema, updateDriverSchema } = require("../validator/driverValidate")
const { createTicketSeller, getAllTicketSellers, getOneTicketSeller, updateTicketSeller, deleteTicketSeller } = require("../controller/ticketSellerController")
const { createTicketSellerSchema, updateTicketSellerSchema } = require("../validator/ticketSellerValidate")
const { jwtAccessMiddleware } = require("../middleware/jwt-accessMiddleware")
const { searchRoute, getSeats, getTrips, seatBooked, getOneSeats } = require("../controller/ticket")
const { roleAccessMiddleware } = require("../middleware/role-accessMidleware")
const { ServerError, notFound, forbidden, toManyRequest } = require("../controller/errorController")
const { getStations, createStation, deleteStation } = require("../controller/stationController")
const { stationCreateSchema } = require("../validator/stationValidate")
const { createTicketSchema } = require("../validator/ticketValidate")
const { limiter } = require("../middleware/limiter")
const upload = multer()

const router = require("express").Router()

router
    // login router
    .get('/login', limiter, loginPage)
    .post('/login', checkSchema(loginValidate), login)
    .get('/logout', logout)

    // Admin router
    .get("/", jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getAllAdmin)
    .post('/create-admin', jwtAccessMiddleware, roleAccessMiddleware('superAdmin'), upload.single("image"), checkSchema(createAdminSchema), createAdmin)
    .post('/admin/:id/delete', jwtAccessMiddleware, roleAccessMiddleware('superAdmin'), deleteAdmin)

    // Bus router
    .post('/create-bus', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), upload.single("image"), checkSchema(createBusSchema), createBus)
    .get('/buses', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getAllBuses)
    .get('/bus/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getOneBus)
    .post('/bus/:id/update', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(updateBusSchema), updateOneBus)
    .post('/bus/:id/delete', jwtAccessMiddleware, deleteOneBus)

    // Route router
    .post('/create-route', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(createRouteSchema), createRoute)
    .get('/routes', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getAllRoutes)
    .get('/route/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getOneRoutes)
    .post('/route/:id/update', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(updateRouteSchema), updateRoute)
    .post('/route/:id/delete', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), deleteRoute)

    // Trip router
    .post('/create-trip', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(createTripSchema), createTrip)
    .get('/trips', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getAllTrips)
    .get('/onetrip/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getOneTrip)
    .post('/trip/:id/update', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(updateTripSchema), updateTrip)
    .post('/trip/:id/delete', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), deleteTrip)

    // Driver router
    .post('/create-driver', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), upload.single("image"), checkSchema(createDriverSchema), createDriver)
    .get('/drivers', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getAllDrivers)
    .post('/driver/:id/update', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(updateDriverSchema), updateDriver)
    .post('/driver/:id/delete', jwtAccessMiddleware, roleAccessMiddleware('superAdmin'), deleteDriver)

    // TicketSeller router
    .post('/create-ticketseller', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(createTicketSellerSchema), createTicketSeller)
    .get('/ticketsellers', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getAllTicketSellers)
    .get('/ticketseller/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getOneTicketSeller)
    .post('/ticketseller/:id/update', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), upload.single('image'), checkSchema(updateTicketSellerSchema), updateTicketSeller)
    .post('/ticketseller/:id/delete', jwtAccessMiddleware, roleAccessMiddleware('superAdmin'), deleteTicketSeller)

    // Station router
    .get('/stations', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), getStations)
    .post('/create-station', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin']), checkSchema(stationCreateSchema), createStation)
    .post('/station/:id/delete', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin']), deleteStation)

    // Ticket router
    .get('/search-trip', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin', 'ticket_seller']), getTrips)
    .get('/search-route', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin', 'ticket_seller']), searchRoute)
    .get('/trip/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin', 'ticket_seller']), getSeats)
    .post('/seatbooked/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin', 'ticket_seller']), checkSchema(createTicketSchema), seatBooked)
    .get('/seat/:id', jwtAccessMiddleware, roleAccessMiddleware(['superAdmin', 'admin', 'ticket_seller']), getOneSeats)

    // Error router
    .get('/403', forbidden)
    .get('/404', notFound)
    .get('/500', ServerError)
    .get('/429', toManyRequest)

module.exports = router