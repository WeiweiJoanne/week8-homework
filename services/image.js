const multer = require('multer')
const path = require('path')

const upload = multer({
  limits:{
    fileSize: 2*1024*1024
  },
  fileFilter(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase()
    if (ext !== '.jpg' && ext !== '.png'){
      cb(new Error("圖檔格式錯誤!!! 僅限上傳 jpg/png "));
    }
    cb(null, true)
  }
}).any()

module.exports = upload
