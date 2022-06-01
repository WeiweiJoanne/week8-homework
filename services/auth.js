const express = require('express')
const jwt = require('jsonwebtoken')
const appErr = require('./appErr')
const UserModel = require('../models/user')

const isAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (!token) {
    return appErr(401, '請登入帳號！', next)
  }

  // const decode = await new Promise((resolve, reject) => {
  //   jwt.verify(token, process.env.JWT_SECRET, function (err, payload) {
  //     if (err){
  //       reject(err)
  //     }else{
  //       resolve(payload)
  //     }
  //   });
  // })

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await UserModel.findById(decode.id)
    req.user = currentUser
    next()
  } catch (err) {
    appErr(401, '登入失敗', next)
  }
  
}

const generateSendJWT = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
  user.password = undefined;
  res.status(statusCode).send({
    status: "success",
    user: {
      token,
      nickName: user.nickName
    }
  })
}

module.exports = { isAuth, generateSendJWT }

