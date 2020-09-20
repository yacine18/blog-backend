const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token)
            return res.status(401).json({ msg: "No authentication token, Authorization denied" })

        const JWT_SECRET = process.env.JWT_SECRET || 'yassine'
        const verified = jwt.verify(token, JWT_SECRET)
        if (!verified) {
            return res.status(401).json({ msg: "Token verification failed, Authorization denied" })
        }


        req.user = verified.id
        next()
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports = auth