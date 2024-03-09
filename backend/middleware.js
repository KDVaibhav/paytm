const dotenv = require("dotenv");
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json([]);
    }
    const token = authHeader.split(" ")[1];

    try{
        const decoded=jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId
        next();
    }catch(err){
        return res.status(403).json({});
    }
}

module.exports = {
    authMiddleware
}