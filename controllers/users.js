const mongoose = require('mongoose')

const UserModel = require('../models/user')
const PostModel = require('../models/posts')

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
    if (nickName && !validator.isLength(nickName, { min: 2 })) {
      return appErr(400, '暱稱至少2個字元以上', next)
    }
    const updateUser = await UserModel.findByIdAndUpdate(req.user.id, {
      nickName, sex
    }, { returnDocument: 'after' })
    handleSuccess(res, updateUser)
  },
  async resetPWD(req, res, next) {
    const { pwd1, pwd2 } = req.body
    if (pwd1 !== pwd2) {
      return appErr(400, '密碼輸入不一致!', next)
    }

    const reg = /^([a-zA-Z]+\d+|\d+[a-zA-Z]+)[a-zA-Z0-9]*$/
    const isMixPwd = reg.test(pwd1)

    if (!validator.isLength(pwd1, { min: 8 }) || !isMixPwd) {
      return appErr(400, '密碼需至少 8 碼以上，並英數混合', next)
    }

    const password = await bcrypt.hash(pwd1, 12)
    const updatePWD = await UserModel.findByIdAndUpdate(req.user._id, {
      password: password
    }, { new: true })
    handleSuccess(res, updatePWD)

  },
  async follow(req, res, next) {
    const user = req.params.userid

    if (user == req.user.id) {
      return appErr(400, '使用者不能追蹤自己', next)
    }

    await UserModel.updateOne(
      {
        _id: req.user.id,
        "following.user": { $ne: user } //有追蹤過的不重複加入追蹤清單
      },
      {
        $push: { following: { user } }
      })

    await UserModel.updateOne(
      {
        _id: user,
        "follower.user": { $ne: req.user.id } //粉絲不重複加入清單
      },
      {
        $push: { follower: { user: req.user.id } }
      })


    res.status(201).send({
      "status": "success",
      "message": "成功追蹤對方"
    })
  },
  async unFollow(req, res, next) {
    const user = req.params.userid

    if (user == req.user.id) {
      return appErr(400, '使用者不能取消追蹤自己', next)
    }

    await UserModel.updateOne(
      {
        _id: req.user.id
      },
      {
        $pull: { following: { user } }
      })

    await UserModel.updateOne(
      {
        _id: user
      },
      {
        $pull: { follower: { user: req.user.id } }
      })


    res.status(201).send({
      "status": "success",
      "message": "成功取消追蹤對方"
    })
  },
  async getLikeList(req, res, next) {
    const _id = req.user.id

    const likeList = await PostModel.find({ likes: { $in: { _id } } })
      .populate({
        path: "user",
        select: "nickName _id"
      })
    res.status(201).send({
      "status": "success",
      likeList
    })

  },
  async getFollowingList(req, res, next) {
    const _id = req.user.id

    const followings = await UserModel.findById({ _id })
      .populate({
        path: "following.user",
        select: "nickName"
      })
      .select('following')

    res.status(201).send({
      "status": "success",
      "followings": followings.following
    })

  }
}

module.exports = UserController
