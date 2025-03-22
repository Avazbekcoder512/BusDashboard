const { verify } = require("jsonwebtoken");
require("dotenv")

exports.jwtAccessMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.authToken

        if (!token) {
            return res.redirect("/login")
        }

        const user = verify(token, process.env.JWT_KEY)

        next()
    } catch (error) {
        console.log(error);

        if (error.stack.includes("JsonWebTokenError")) {
            return res.status(400).send({
                message: "Invalid token!",
            });
        }

        return res.status(500).send({
            error: "Serverda xatolik!"
        })
    }
}