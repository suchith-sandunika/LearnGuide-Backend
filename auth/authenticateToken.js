const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    console.log("Session data:", req.session);
    const token = req.cookies.authToken;
    console.log("Token from session:", token);
    if (!token) return res.status(401).json({ message: 'Unauthorized, please login' });

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) return res.status(403).json({ message: 'Token expired or invalid' });

        // Attach teacher's data from token to the request object for easy access
        req.user = decodedToken;
        next();
    });
};

module.exports = authenticateToken;