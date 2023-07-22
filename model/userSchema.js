const mongoose = require("mongoose");


const usersSchema = mongoose.Schema({
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
        require: true,
        unique: true,
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
    address:{
        type: String,
        required: true,
    },
    cart: Array,
});

const userModel = mongoose.model("users", usersSchema);

module.exports = { userModel};
