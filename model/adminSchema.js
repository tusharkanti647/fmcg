const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const secretKey = process.env.KEY;

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, //left and right side of the name if have any spce it trimes
    },
    number: {
        type: String,
        required: true,
        unique: true, // it creat the number is unique
        maxLength: 10, //it creat the length of the number only 10
    },
    email: {
        type: String,
        unique: true,
        require: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    conPassword: {
        type: String,
        required: true,
        minLength: 6,
    },

    isAdmin: { type: Boolean, default: true }

});



const adminModel = mongoose.model("admins", adminSchema);





module.exports = { adminModel};
