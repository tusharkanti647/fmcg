const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { registerUser, signinUser } = require('../controllers/userControllers');

router.use(bodyParser.json());


router.post('/user-register', registerUser);
router.post("/user-signin", signinUser);

module.exports = router;