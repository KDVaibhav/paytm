const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error){
        console.error("faled to connect to MongoDB", error)
    }
}

const userSchema = mongoose.Schema(
    {
        username:{
            firstName: {
                type: String,
                required: [true, "Please add a firstName"],
            },
            lastName: {
                type: String,
                required: [true, "Please add a lastName"]
            }
        },
        email:{
            type: String,
            required: [true, "Please add and email"],

        },
        password:{
            type: String,
            required:[true, "Please add a password"],
        }
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("Users", userSchema)

module.exports = {connectDB, User};