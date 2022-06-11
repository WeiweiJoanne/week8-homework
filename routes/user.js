var express = require('express');
var router = express.Router();

// const jwt = require('jsonwebtoken')
// const validator = require('validator')
// const bcrypt = require('bcryptjs')

const UserController = require('../controllers/users')
const handErrAsync = require('../services/handErrAsync')
const { isAuth } = require('../services/auth')

router.get('/', handErrAsync(UserController.getUsers));

router.post('/sign_up', handErrAsync(UserController.addUser));
router.post('/sign_in', handErrAsync(UserController.getUser));
router.get('/profile', isAuth, handErrAsync(UserController.getProfile));
router.patch('/profile', isAuth, handErrAsync(UserController.updateProfile));
router.post('/updatePassword', isAuth, handErrAsync(UserController.resetPWD));

router.post('/:userid/follow', isAuth, handErrAsync(UserController.follow));
router.delete('/:userid/unfollow', isAuth, handErrAsync(UserController.unFollow));

router.get('/getLikeList', isAuth, handErrAsync(UserController.getLikeList));
router.get('/following', isAuth, handErrAsync(UserController.getFollowingList));

module.exports = router;
