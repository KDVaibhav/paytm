const express = require("express");
const router = express.Router();

const zod = require("zod");
const {User, Account} = require("../db");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { authMiddleware } = require("../middleware");
dotenv.config();

const signUpBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})

const signInBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})


router.post("/login", async function(req, res){
    const {success} = signInBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Incorrect Inputs"
        })
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, process.env.SECRET_KEY);
        
        return res.status(200).json({
            msg: "SignIn Successfully",
            token: token
        })
    }

    return res.status(411).json({
        msg: 'Invalid Credentials'
    })
})

router.post("/signup", async function(req, res) {
    const {success} = signUpBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const existingUser = await User.findOne({
        username: req.body.username
    })

    if(existingUser){
        return res.status(411).json({
            msg: "Email already taken"
        })
    }
    
    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    })

    const userId = user._id;

    await Account.create({
        userId, 
        balance: 1+Math.random()*1000
    })

    const token = jwt.sign({
        userId
    }, process.env.SECRET_KEY)
    

    res.json({
        message: "User created Successfully",
        token: token
    })
})


router.put("/", authMiddleware, async(req, res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.status(200).json({
        msg: "Updated Successfully"
    })
    
})

router.get("/bulk", async(rew, res)=>{
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        },{
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;