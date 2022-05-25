var express = require('express');
var router = express.Router();

const UserController = require('../controllers/users')

router.get('/', UserController.getUser);

module.exports = router;
