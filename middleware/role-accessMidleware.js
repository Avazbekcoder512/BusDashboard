const { verify } = require("jsonwebtoken");
require('dotenv')

exports.roleAccessMiddleware = function (roles) {
    return async function (req, res, next) {
        try {
            const token = req.cookies.authToken
            if (!token) {
                return res.status(404).send({
                    error: 'Token not provided',
                });
            }

            const { role } = verify(token, process.env.JWT_KEY);

            if (!roles.includes(role)) {
                return res.status(403).send({
                    error: "Sizga ruxsat yo'q",
                });
            }

            next();
        } catch (error) {
            console.log(error);

            if (error.message) {
                return res.status(400).send({
                    error: error.message,
                });
            }

            return res.status(500).send('Serverda xatolik!');
        }
    };
};