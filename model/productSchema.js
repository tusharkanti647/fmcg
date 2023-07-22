const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const secretKey = process.env.KEY;

const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    imgLink: {
        type: String,
        required: true,
    },
    titel: {
        type: String,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
    about: {
        weight: { 
            type: String
        },
        pcs: {
            type: Number,
        },
        description: {
            type: String,
        },
    }

});

const productModel = mongoose.model("products", productSchema);

module.exports = { productModel };