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
          const newArrivalMoment  = moment(newDepartureMoment).add(tripDuration, 'milliseconds');
          const newDepDate        = newDepartureMoment.format('YYYY-MM-DD');
          const newArrDate        = newArrivalMoment.format('YYYY-MM-DD');
  
          // tekshiruv
          const exists = await tripModel.findOne({
            route: trip.route,
            bus: trip.bus,
            departure_date: newDepDate,
            departure_time: trip.departure_time
          });
          if (exists) continue;
  
          const bus   = await busModel.findById(trip.bus);
          const route = await routeModel.findById(trip.route);
          if (!bus || !route) {
            console.warn('Bus yoki route topilmadi, ID:', trip.bus, trip.route);
            continue;
          }
  
          // yangi reys
          const createdTrip = await tripModel.create({
            route: trip.route,
            bus: trip.bus,
            departure_date: newDepDate,
            departure_time: trip.departure_time,
            arrival_date: newArrDate,
            arrival_time: trip.arrival_time,
            seats: []
          });
  
          // joylarni yaratish
          const seats = [];
          for (let i = 1; i <= 51; i++) {
            let seatClass, price;
            if (i <= 8)            { seatClass = 'vip';     price = trip.ticket_price; }
            else if (i <= 26)      { seatClass = 'premium'; price = trip.ticket_price - 50000; }
            else                   { seatClass = 'economy'; price = trip.ticket_price - 100000; }
  
            const seat = new seatModel({
              seatNumber: i,
              trip: createdTrip._id,    // <-- tuzatildi
              price,
              class: seatClass
            });
            await seat.save();
            seats.push(seat._id);
          }
  
          // saqlash va yangilashlar
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
        // 1) cutoff vaqtini aniqlaymiz
        const cutoff = moment().subtract(1, 'days').toISOString();

        // 2) eskirgan trip hujjatlarini olib kelamiz
        const expiredTrips = await tripModel.find({ departure_date: { $lt: cutoff } });
        if (!expiredTrips.length) {
            console.log("Eskirgan reyslar topilmadi.");
            return;
        }

        // 3) ularning ID’larini array kunga olish
        const expiredIds = expiredTrips.map(t => t._id);

        // 4) shu triplarga tegishli seats’larni o‘chirib tashlash
        const seatsResult = await seatModel.deleteMany({ trip: { $in: expiredIds } });
        console.log(`${seatsResult.deletedCount} ta o‘rin­diq o‘chirildi.`);

        // 5) shu tripId’larni route hujjatining trips arrayidan olib tashlash
        const routesResult = await routeModel.updateMany(
            { trips: { $in: expiredIds } },
            { $pull: { trips: { $in: expiredIds } } }
        );
        console.log(`${routesResult.nModified} ta route yangilandi.`);

        // 6) nihoyat, eskirgan trip’larni o‘chirish
        const tripsResult = await tripModel.deleteMany({ _id: { $in: expiredIds } });
        console.log(`${tripsResult.deletedCount} ta eskirgan reys o‘chirildi.`);

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
