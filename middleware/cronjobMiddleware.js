const cron = require("node-cron");
const moment = require('moment');
const tripModel = require("../models/trip");
const busModel = require("../models/bus");
const routeModel = require("../models/route");
const seatModel = require("../models/seat");
const tempTicketModel = require("../models/tempticket");

const createNextThreeTrips = async () => {
    try {
        const baseTrips = await tripModel.find();
        let createdCount = 0;

        for (const trip of baseTrips) {
            const tripDuration = moment(trip.arrival_date).diff(moment(trip.departure_date));

            for (let dayOffset = 1; dayOffset <= 3; dayOffset++) {
                const newDepartureMoment = moment().add(dayOffset, 'days');
                const newArrivalMoment = moment(newDepartureMoment).add(tripDuration, 'milliseconds');
                const newDepISO = newDepartureMoment.toISOString();
                const newArrISO = newArrivalMoment.toISOString();

                const exists = await tripModel.findOne({
                    route: trip.route,
                    bus: trip.bus,
                    departure_date: newDepISO,
                    departure_time: trip.departure_time
                });
                if (exists) continue;

                const bus = await busModel.findById(trip.bus);
                const route = await routeModel.findById(trip.route);
                if (!bus || !route) {
                    console.warn('Bus yoki route topilmadi, ID:', trip.bus, trip.route);
                    continue;
                }

                const createdTrip = await tripModel.create({
                    route: trip.route,
                    bus: trip.bus,
                    departure_date: newDepISO,
                    departure_time: trip.departure_time,
                    arrival_date: newArrISO,
                    arrival_time: trip.arrival_time,
                    ticket_price: trip.ticket_price,
                    seats: []
                });

                const seats = [];
                for (let i = 1; i <= bus.seats_count; i++) {
                    const seat = await seatModel.create({ seatNumber: i, trip: createdTrip._id, price: trip.ticket_price });
                    seats.push(seat._id);
                }
                createdTrip.seats = seats;
                await createdTrip.save();

                await routeModel.findByIdAndUpdate(route._id, { $push: { trips: createdTrip._id } });
                await busModel.findByIdAndUpdate(bus._id, { trip: createdTrip._id });

                createdCount++;
            }
        }

        console.log(`${createdCount} ta yangi reys yaratildi.`);
    } catch (error) {
        console.error("❌ Yangi reyslar yaratishda xatolik:", error);
    }
};

const deleteExpiredTrips = async () => {
    try {
        const cutoff = moment().subtract(1, 'days').toISOString();
        const result = await tripModel.deleteMany({ departure_date: { $lt: cutoff } });
        console.log(`${result.deletedCount} ta eskirgan reys o‘chirildi.`);
    } catch (error) {
        console.error("❌ Eskirgan reyslarni o'chirish xatosi:", error);
    }
};

const deleteExpiredTempTickets = async () => {
    try {
        const cutoff = moment().subtract(1, 'days').toISOString();
        const result = await tempTicketModel.deleteMany({ createdAt: { $lt: cutoff } });
        console.log(`${result.deletedCount} ta eskirgan temp ticket o‘chirildi.`);
    } catch (error) {
        console.error("❌ Eskirgan temp ticketlarni o'chirish xatosi:", error);
    }
};

cron.schedule('0 0 */2 * *', async () => {
    await createNextThreeTrips();
});

cron.schedule('0 0 * * *', async () => {
    await deleteExpiredTrips();
    await deleteExpiredTempTickets()
});

module.exports = { createNextThreeTrips, deleteExpiredTrips, deleteExpiredTempTickets };
