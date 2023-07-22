const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { addProduct, getProductList } = require('../controllers/productControllers');

const secretKey = process.env.KEY;
require("./passport");

router.use(bodyParser.json());

//product routers
router.post("/add-product", passport.authenticate('jwt', { session: false }), addProduct);
router.get("/products-search",  getProductList);


module.exports = router;