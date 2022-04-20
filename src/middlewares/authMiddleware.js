import jwt from 'jsonwebtoken'

const protect = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.status(401)
        .json({
            err: 'No token provided'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(403)
            .json({
                err: 'Invalid token'
            });
        }
        req.user = payload;
        
        next()
    })
}

export default protect;

