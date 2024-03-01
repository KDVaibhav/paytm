const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require('cors');
const {connectDB, user, User } = require("./db");
const jwt = require("jsonwebtoken");
dotenv.config;
const secretKey=process.env.SECRET_KEY;
const app = express();
app.use(bodyParser.json());
app.use(cors());
connectDB();

app.post("/api/login", async function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    try{
        const existingUser = await User.findOne({email: email});
        if(!existingUser){
            return res.status(404).json({msg: "User not found"});
        }
        if(existingUser.password!==password){
            return res.status(401).json({msg: "Incorrect password"});
        }
        const token=jwt.sign(existingUser.email, secretKey);
        return res.status(200).json({
            msg: "Login successful",
            token: token
        })
    } catch(error){
        console.error("Error:", error);
        return res.status(500).json({msg: "Internal Server Error"})
    }
})

