const jwt = require('jsonwebtoken');
const { Blacklist } = require("../../modules/users/userModel");

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token){
        return res.status(401).json({
            message: 'Token diperlukan'
        })
    }

    const checkIfBlacklisted = await Blacklist.findOne({where: { token: token }});
    if (checkIfBlacklisted) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;

    try {
        const decodedToken = jwt.verify(token, secret);
        const user = await decodedToken;
        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

module.exports = authenticateJWT;