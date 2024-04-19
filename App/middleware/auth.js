const jwt = require('jsonwebtoken');
var secretKey = "h9RtE5wPqLsGz";
const BlacklistedToken = require('../Modals/blacklistedToken');

function authMiddleware(req, res, next) {
    const token = req.query['_encoding']; // Assuming you're sending the token in the 'x-auth-token' header

    if (!token || token == "") {
        res.redirect('/authlogin');
        return;
    }

    BlacklistedToken.findOne({ token }, (err, blacklistedToken) => {
        if (err) {
            return res.status(500).json({ message: 'An error occurred' });
        }
        if (blacklistedToken) {
            res.redirect('/authlogin');
            return;
        }
        try {
            const decoded = jwt.verify(token, secretKey);
            req.token = decoded;
            next();
        } catch (error) {
            res.redirect('/authlogin');
            return;
        }
    })
}

module.exports = authMiddleware;
