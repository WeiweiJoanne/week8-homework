var express = require('express');
var router = express.Router();

const UserController = require('../controllers/users')
const handErrAsync = require('../services/handErrAsync')

router.get('/', handErrAsync(UserController.getUser));
router.post('/', handErrAsync(UserController.postUser));

module.exports = router;
