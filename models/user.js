const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  nickName: {
    type: String,
    required: [true, '請輸入您的暱稱']
  },
  email: {
    type: String,
    required: [true, '請輸入您的 Email'],
    unique: true,
    lowercase: true,
    select: false
  },
  password: {
    type: String,
    required: [true, '請輸入您的 password'],
    select: false
  },
  photo: {
    type: String
  }
},{
  versionKey: false
})

const User = mongoose.model('user', userSchema)

module.exports = User
