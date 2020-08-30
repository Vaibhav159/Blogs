const express = require('express');
const router = express.Router();

const UserController = require('../controller/users')

//user signup
router.post('/signup', UserController.signup)

//user signin
router.post('/signin', UserController.signin)

module.exports = router;
