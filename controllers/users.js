const mongoose = require('mongoose')

const UserModel = require('../models/user')

const handleError = require('../services/handleError')
const appErr = require('../services/appErr')
const handleSuccess = require('../services/handleSuccess')

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
    }else{
      return appErr(400, 'email 重複', next)
    }

  }
}

module.exports = UserController
