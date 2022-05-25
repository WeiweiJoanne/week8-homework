const mongoose = require('mongoose')

const UserModel = require('../models/user')

const UserController = {
  async getUser(req,res){
    const getUser = await UserModel.find({})
    res.send({
      "status":"success",
      getUser
    })
    res.end()
  }
}

module.exports = UserController
