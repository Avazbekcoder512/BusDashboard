const cron = require('node-cron');
const routeModel = require('../models/route');


const updateRouteStatus = async () => {
    try {
        const now = new Date();

        const pendingTrips = await routeModel.find({
            departure_time: { $lte: now },
            status: "Pending"
        });
    
        for (let route of pendingTrips) {
            route.status = "Active";  
            await route.save();
        }

    } catch (error) {
        console.error("❌ updateRouteStatus xatolik:", error);
    }
};

const checkAndUpdateRoutes = async () => {
    try {
        const now = new Date();

        const completedRoutes = await routeModel.find({
            arrival_time: { $lte: now },
            status: "Active"
        });

        if (completedRoutes.length === 0) return;

        await routeModel.updateMany(
            { arrival_time: { $lte: now }, status: "Active" },
            { $set: { status: "Completed" } }
        );

        console.log(`✅ ${completedRoutes.length} ta marshrut "Completed" holatiga o‘zgartirildi.`);

        for (let route of completedRoutes) {
            let returnDate = new Date(route.arrival_time);

            if (route.distance >= 200) {  
                returnDate.setDate(returnDate.getDate() + 1);
            }

            let returnDepartureTime = returnDate.toISOString().split('T')[0] + " 08:00";
            let returnArrivalTime = returnDate.toISOString().split('T')[0] + " 22:00";

            const returnRoute = new routeModel({
                from: route.to,   
                to: route.from,   
                departure_time: returnDepartureTime,  
                arrival_time: returnArrivalTime,  
                bus_id: route.bus_id,
                price: route.price,
                distance: route.distance,
                status: "Pending"
            });

            await returnRoute.save();
        }

        console.log(`🔄 ${completedRoutes.length} ta qaytish marshruti yaratildi.`);
    } catch (error) {
        console.error("❌ checkAndUpdateRoutes xatolik:", error);
    }
};

const startRouteStatus = () => {
    cron.schedule("* * * * *", async () => {
        // console.log("⏳ Marshrut statuslari yangilanmoqda...");
        await updateRouteStatus();
    });

    cron.schedule("* * * * *", async () => {
        // console.log("🔄 Qaytish marshrutlari tekshirilmoqda...");
        await checkAndUpdateRoutes();
    });
};

module.exports = { startRouteStatus };
