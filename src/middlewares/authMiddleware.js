import jwt from 'jsonwebtoken'

const isAuthenticated = (req, res, next) => {

    const authHeader = (req.cookies && req.cookies["jwt"]) || req.headers["authorization"];
    const token = authHeader && authHeader.split(' ')[1] || authHeader;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return res
                    .json({
                        msg: 'Invalid token',
                        status: false
                    });
            }
            req.user = payload;
        });
    } else if (!req.user) {
        return res
            .json({
                msg: 'Not authorized',
                status: false
            });
    }

    next();
}

export default isAuthenticated;

