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
        type: String,
    },
    about: {
        weight: [],
        pcs: {
            type: String,
        },
        description: {
            type: String,
        },
    }

});

const productModel = mongoose.model("products", productSchema);

module.exports = { productModel };