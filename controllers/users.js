const mongoose = require('mongoose')

const UserModel = require('../models/user')

const handleError = require('../services/handleError')
const appErr = require('../services/appErr')
const handleSuccess = require('../services/handleSuccess')

const validator = require('validator')
const bcrypt = require('bcryptjs')

const UserController = {
  async getUser(req, res, next) {
    const getUser = await UserModel.find({})
    handleSuccess(res, getUser)
  },
  async postUser(req, res, next) {
    const body = req.body
    const { name, email, photo } = body

    if (email === undefined || email.trim() == '') {
      return appErr(400, '請填寫email', next)
    }

    const hasUser = await UserModel.findOne({ email: email }).exec()

    if (hasUser === null) {
      const addUser = await UserModel.create({ name, email, photo })
      handleSuccess(res, addUser)
    } else {
      return appErr(400, 'email 重複', next)
    }

  },
  async addUser(req, res, next) {
    const { nickName, email, password } = req.body
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
    const isPassword = reg.test(password)

    if (!validator.isLength(password, { min: 8 }) || !isPassword) {
      return appErr(400, '密碼需至少 8 碼以上，並英數混合', next)
    }

    
    const addUser = await UserModel.create()


  }
}

module.exports = UserController
