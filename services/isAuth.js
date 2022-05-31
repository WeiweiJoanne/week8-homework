const express = require('express')
const jwt = require('jsonwebtoken')
const handErrAsync = require('./handErrAsync')
const handleError = require('./handleError')
const UserModel = require('../models/user')

const isAuth = handErrAsync(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

  }
  res.send(req.headers.authorization)
})

module.exports = isAuth

