const jwt = require("jsonwebtoken");
const privateOrSecretKey = process.env.key

function authUserLogin(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        req.userData = jwt.verify(token, privateOrSecretKey);
        req.userRole = req.userData.userRole;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Auth Failed"
        })
    }
}

function authRole(role) {
    return (req, res, next) => {
        if (req.userRole !== role) {
            return res.status(401).json({
                message : "User not allowed"
            })
        }
        next();
    }
}

module.exports = {
    authUserLogin,
    authRole
};