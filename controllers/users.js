const mongoose = require('mongoose')

const UserModel = require('../models/user')

const handleError = require('../services/handleError')
const handleSuccess = require('../services/handleSuccess')
const UserController = {
  async getUser(req, res) {
    const getUser = await UserModel.find({})
    handleSuccess(res, getUser)
  },
  async postUser(req, res) {

    try {
      const body = req.body
      const { name, email, photo } = body


      const hasUser = await UserModel.findOne({ email: email }).exec()

      if (hasUser == null){
        const addUser = await UserModel.create({ name, email, photo})
        handleSuccess(res, addUser)
      }else{
        handleError(res)
      }
    } catch (err) {
      handleError(res,err)
    }

  }
}

module.exports = UserController
