const { RateLimiterMemory } = require('rate-limiter-flexible')

const rateLimiter = new RateLimiterMemory({
    points: 5,
    duration: 60,
    blockDuration: 300
});

exports.limiter = async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip)
        next()
    } catch (rateLimiterRes) {
        return res.redirect('/429')
    }
}
