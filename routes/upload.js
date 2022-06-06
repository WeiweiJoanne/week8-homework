var express = require('express');
var router = express.Router();
const handErrAsync = require('../services/handErrAsync')
const isImage = require('../services/image')
const { isAuth } = require('../services/auth')
const uploadImg = require('../controllers/uploadImg')

router.post('/upload', isAuth, isImage, handErrAsync(uploadImg))

module.exports = router
