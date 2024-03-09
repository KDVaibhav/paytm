const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error){
        console.error("failed to connect to MongoDB", error)
    }
}

const userSchema =new mongoose.Schema(
    {
        username:{
            type: String,
            required: [true, "Please add a username"],
            unique: true,
            trim: true,
            lowercase: true,
            minLength: 3,
            maxLength: 30        
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxLength: 50
        },
        password:{
            type: String,
            required:[true, "Please add a password"],
            minLength: 6
        }
    },
    {
        timestamps: true,
    }
)

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type:Number,
        required: true
    }
})

const User = mongoose.model("Users", userSchema);
const Account = mongoose.model('Accounts', accountSchema);

module.exports = {connectDB, User, Account};