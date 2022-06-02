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

    if (!correctPWD) {
      return appErr(401, '帳號或密碼錯誤，請重新輸入！', next)
    }
    generateSendJWT(user, 200, res)
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
    generateSendJWT(addUser, 201, res)
  },
  async getProfile(req, res, next) {
    handleSuccess(res, req.user)
  },
  async updateProfile(req, res, next) {
    const { nickName, sex } = req.body
    if (!validator.isLength(nickName, { min: 2 })) {
      return appErr(400, '暱稱至少2個字元以上', next)
    }
    const updateUser = await UserModel.findByIdAndUpdate(req.user._id, {
      nickName, sex
    }, { new: true })
    handleSuccess(res, updateUser)
  },
  async resetPWD(req, res, next) {
    const { pwd1, pwd2 } = req.body
    if (pwd1 !== pwd2) {
      return appErr(400, '密碼輸入不一致!',next)
    }

    const reg = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/
    const isMixPwd = reg.test(pwd1)

    if (!validator.isLength(pwd1, { min: 8 }) || !isMixPwd) {
      return appErr(400, '密碼需至少 8 碼以上，並英數混合', next)
    }

    const password = await bcrypt.hash(pwd1, 12)
    const updatePWD = await UserModel.findByIdAndUpdate(req.user._id,{
      password: password
    }, { new: true})
    handleSuccess(res, updatePWD)

  }
}

module.exports = UserController
