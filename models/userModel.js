const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name is Required!"],
    },
    email:{
        type: String,
        required: [true, "Email is Required!"],
        unique: true,
    },
    password:{
        type: String,
        required: [true, "Password is Required!"],
    }
},
{timestamps: true}
)

const userModel = mongoose.model('users', userSchema)
module.exports = userModel