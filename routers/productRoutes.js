const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { addProduct, getProductList, getOneProductDetails, productDelete, editProduct } = require('../controllers/productControllers');

const secretKey = process.env.KEY;
require("../passport");

router.use(bodyParser.json());

//product routers
router.post("/add-product", passport.authenticate('jwt', { session: false }), addProduct);
router.get("/products-search",  getProductList);
router.get("/get-One-Product/:id",  getOneProductDetails);
router.delete("/product-delete/:id", passport.authenticate('jwt', { session: false }), productDelete);
router.put("/product-edit/:id", passport.authenticate('jwt', { session: false }), editProduct);


module.exports = router;