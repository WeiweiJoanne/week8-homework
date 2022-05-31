var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserController = require('../controllers/users')
const handErrAsync = require('../services/handErrAsync')
const isAuth = require('../services/isAuth')

router.get('/', handErrAsync(UserController.getUser));
router.post('/', handErrAsync(UserController.postUser));

router.post('/sign_up', handErrAsync(UserController.addUser));

module.exports = router;
