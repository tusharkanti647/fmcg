const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { curtAddProduct, removeOneCurtProduct, emptyCurt, getCurtDetails, editCurtQuantity } = require('../controllers/cartControllers');


const secretKey = process.env.KEY;
require("./passport");

router.use(bodyParser.json());

//cart routers
//------------------------------------------------------------------------------
router.get("/get-curt", passport.authenticate('jwt', { session: false }), getCurtDetails);
router.patch("/cart/:id", passport.authenticate('jwt', { session: false }), curtAddProduct);
router.patch("/remove-curt-product", passport.authenticate('jwt', { session: false }),  removeOneCurtProduct);
router.delete("/empty-curt", passport.authenticate('jwt', { session: false }), emptyCurt);
router.patch("/curt-product/quantity-update", passport.authenticate('jwt', { session: false }), editCurtQuantity);



module.exports = router;