const cron = require("node-cron");
const moment = require('moment');
const tripModel = require("../models/trip");

const createWeeklyRoutes = async () => {
    try {
        const existingTrips = await tripModel.find();
        let createdCount = 0

        for (const trip of existingTrips) {
            const newDepartureDate = moment(trip.departure_date).add(7, "days").toISOString()
            const newArrivalDate = moment(trip.arrival_date).add(7, "days").toISOString()

            const existingTrips = await tripModel.findOne({
                route: trip.route,
                bus: trip.bus,
                departure_date: trip.departure_date
            })

            if (!existingTrips) {
                await tripModel.create({
                    route: trip.route,
                    bus: trip.bus,
                    departure_date: newDepartureDate,
                    departure_time: trip.departure_time,
                    arrival_date: newArrivalDate,
                    arrival_time: trip.arrival_time,
                    ticket_price: trip.ticket_price
                })
                createdCount++;
            }
            console.log(`${createdCount} ta yangi reys yaratildi.`);
        }
    } catch (error) {
        console.error("❌ Xatolik yuz berdi:", error);
    }
};

const deleteOldRoutes = async () => {
    try {
        const deleteDate = moment().subtract(3, 'days').toISOString()
        const deletedTrips = await tripModel.deleteMany({ departure_date: { $lt: deleteDate } })
        console.log(`${deletedTrips.deletedCount} ta eski reys o‘chirildi.`);
    } catch (error) {
        console.error("❌ O‘tib ketgan reyslarni o‘chirishda xatolik yuz berdi:", error);
    }
};

cron.schedule('0 0 * * 1', async () => {
    await createWeeklyRoutes()
})

cron.schedule("0 0 */3 * *", async () => {
    await deleteOldRoutes();
});

module.exports = { createWeeklyRoutes, deleteOldRoutes };
