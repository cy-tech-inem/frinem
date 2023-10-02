const jwt = require("jsonwebtoken");

const generateAccessToken = (dollarName) => {
    return jwt.sign({ name: dollarName }, process.env.JWT_SECRET)
}

const verifyJWT = (req, res, next) => {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
        res.status(403).json({ error: { message: "No token" } })
    } else {
        const token = bearerToken.substring(7);
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ error: { auth: false, message: "Failed authenticate" } });
            } else {
                next();
            }
        })
    }
}

module.exports = {
    verifyJWT,
    generateAccessToken,
}