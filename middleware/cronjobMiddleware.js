const cron = require("node-cron");
const routeModel = require("../models/route");

const calculateTravelDays = (distance) => {
    return distance > 600 ? 1 : 0;
};

const createDailyRoutes = async () => {
    try {
        const routes = await routeModel.find();

        if (routes.length === 0) {
            console.log("❌ Hech qanday reys mavjud emas!");
            return;
        }

        for (const route of routes) {
            for (let i = 1; i <= 2; i++) {
                const departureDate = new Date();
                departureDate.setDate(departureDate.getDate() + i);
                const formattedDepartureDate = departureDate.toISOString().split("T")[0];

                const travelDays = calculateTravelDays(route.distance);
                const arrivalDate = new Date(departureDate);
                arrivalDate.setDate(arrivalDate.getDate() + travelDays);
                const formattedArrivalDate = arrivalDate.toISOString().split("T")[0];

                await routeModel.create({
                    name: route.name,
                    from: route.from,
                    to: route.to,
                    departure_time: route.departure_time,
                    arrival_time: route.arrival_time,
                    departure_date: formattedDepartureDate,
                    arrival_date: formattedArrivalDate,
                    price: route.price,
                    bus_id: route.bus_id,
                    distance: route.distance
                });

                const returnDepartureDate = new Date(formattedArrivalDate);
                const formattedReturnDepartureDate = returnDepartureDate.toISOString().split("T")[0];

                const returnArrivalDate = new Date(returnDepartureDate);
                returnArrivalDate.setDate(returnArrivalDate.getDate() + travelDays);
                const formattedReturnArrivalDate = returnArrivalDate.toISOString().split("T")[0];

                await routeModel.create({
                    name: `${route.to}-${route.from}`,
                    from: route.to,
                    to: route.from,
                    departure_time: route.arrival_time,
                    arrival_time: route.departure_time,
                    departure_date: formattedReturnDepartureDate,
                    arrival_date: formattedReturnArrivalDate,
                    price: route.price,
                    bus_id: route.bus_id,
                    distance: route.distance
                });
            }
        }

        console.log("✅ Ertaga va Indinga reyslar yaratildi!");

    } catch (error) {
        console.error("❌ Xatolik yuz berdi:", error);
    }
};

const deleteOldRoutes = async () => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const result = await routeModel.deleteMany({ arrival_date: { $lt: today } });

        console.log(`🗑 ${result.deletedCount} ta o‘tib ketgan reyslar o‘chirildi.`);
    } catch (error) {
        console.error("❌ O‘tib ketgan reyslarni o‘chirishda xatolik yuz berdi:", error);
    }
};

cron.schedule("0 0 * * *", async () => {
    console.log("🔄 Yangi reyslarni yaratish va eskilarini o‘chirish boshlandi...");
    await deleteOldRoutes();
    await createDailyRoutes();
});

module.exports = { createDailyRoutes, deleteOldRoutes };
