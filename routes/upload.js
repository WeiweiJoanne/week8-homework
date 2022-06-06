var express = require('express');
var router = express.Router();
const sizeOf = require('image-size')
const handErrAsync = require('../services/handErrAsync')
const appErr = require('../services/appErr')
const isImage = require('../services/image')
const { isAuth } = require('../services/auth')
const { ImgurClient } = require('imgur');

router.post('/upload', isAuth, isImage, handErrAsync(async (req, res, next) => {
  console.log(req)
  if (!req.files.length) {
    return next(appErr(400, "尚未上傳檔案", next));
  }
  const dimensions = sizeOf(req.files[0].buffer)
  if (dimensions.width !== dimensions.height) {
    return next(appErr(400, "非 1:1 圖檔比例", next));
  }

  const client = new ImgurClient({ 
    clientId: process.env.IMGUR_CLIENTID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });

  const response = await client.upload({
    image: req.files[0].buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID
  });
  res.status(200).send({
    "status": "success",
    "imgLink": response.data.link
  })
}))

module.exports = router