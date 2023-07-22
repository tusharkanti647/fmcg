const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { registerAdmin, signinAdmin } = require('../controllers/adminControllers');

router.use(bodyParser.json());


router.post('/admin-register', registerAdmin);
router.post("/admin-signin", signinAdmin);

module.exports = router;