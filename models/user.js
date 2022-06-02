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
  sex: {
    type: String,
    enum: ["male", "female"]
  },
  photo: String,
  password: {
    type: String,
    required: [true, '請輸入密碼'],
    minlength: 8,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  }
},{
  versionKey: false
})

const User = mongoose.model('user', userSchema)

module.exports = User
