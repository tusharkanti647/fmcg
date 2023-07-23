const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { registerAdmin, signinAdmin, getCustomer, deleteCustomer, getOneCustomerDetails } = require('../controllers/adminControllers');

router.use(bodyParser.json());

//admin signUp and signIn routes
router.post('/admin-register', registerAdmin);
router.post("/admin-signin", signinAdmin);

//admin control the user routes


/**
 * @openapi
 * '/customer-get':
 *  get:
 *     tags:
 *     - Hero
 *     summary: Get all heroes
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: number
 *                  name:
 *                    type: string
 *       400:
 *         description: Bad request
 */
router.get("/customer-get", passport.authenticate('jwt', { session: false }), getCustomer);
router.delete("/customer-delete/:id", passport.authenticate('jwt', { session: false }), deleteCustomer);
router.get("/get-customer-details/:id", passport.authenticate('jwt', { session: false }),  getOneCustomerDetails);

module.exports = router;