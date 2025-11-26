const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'Access Denied: No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid Token' });
    }
};

const verifyBanker = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'banker') {
            next();
        } else {
            res.status(403).json({ message: 'Access Denied: Bankers Only' });
        }
    });
};

module.exports = { verifyToken, verifyBanker };
