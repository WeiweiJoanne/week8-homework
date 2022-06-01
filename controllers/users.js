const mongoose = require('mongoose')

const UserModel = require('../models/user')

// const handleError = require('../services/handleError')
const appErr = require('../services/appErr')
const handleSuccess = require('../services/handleSuccess')
const { generateSendJWT } = require('../services/auth')

const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserController = {
  async getUsers(req, res, next) {
    const getUser = await UserModel.find({})
    handleSuccess(res, getUser)
  },
  async getUser(req, res, next) {
    const { email, password } = req.body
    if (!email || !password) {
      return appErr(400, '請填寫空白欄位！', next)
    }
    const user = await UserModel.findOne({ email }).select('+password')
    const correctPWD = await bcrypt.compare(password, user.password)

    if (!correctPWD){
      return appErr(401, '帳號或密碼錯誤，請重新輸入！', next)
    }

    generateSendJWT(user,200,res)

  },
  async addUser(req, res, next) {
    let { nickName, email, password } = req.body
    if (!nickName || !email || !password) {
      return appErr(400, '請填寫必填欄位', next)
    }

    if (!validator.isLength(nickName, { min: 2 })) {
      return appErr(400, '暱稱至少2個字元以上', next)
    }

    if (!validator.isEmail(email)) {
      return appErr(400, '不符合email格式', next)
    }

    const reg = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/
    const isMixPwd = reg.test(password)

    if (!validator.isLength(password, { min: 8 }) || !isMixPwd) {
      return appErr(400, '密碼需至少 8 碼以上，並英數混合', next)
    }

    password = await bcrypt.hash(password, 12)
    const addUser = await UserModel.create({ nickName, email, password })
    // console.log(addUser);
    generateSendJWT(addUser, 201, res)
  },
  async getProfile(req, res, next) {
    res.status(200).send({
      "status": "success",
      "user": req.user
    })
  }
}

module.exports = UserController
