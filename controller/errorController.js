exports.ServerError = async (req, res) => {
    const token = req.cookies.authToken
    return res.render('500', {
        token,
        layout: false
    })
}

exports.notFound = async (req, res) => {
    const token = req.cookies.authToken
    return res.render('404', {
        token,
        layout: false
    })
}

exports.forbidden = async ( req, res) => {
    const token = req.cookies.authToken
    return res.render('403', {
        token,
        layout: false
    })
}

exports.toManyRequest = async (req, res) => {
    return  res.render('429', {
        layout: false
    })
}