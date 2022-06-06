require('./connections')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var postsRouter = require('./routes/posts');
var uploadImgRouter = require('./routes/upload');

const resErr = require('./services/resErr')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(postsRouter)
app.use(uploadImgRouter)
// app.use('/posts', postsRouter);
// app.use('/post', postsRouter);

app.use(function (req, res, next) {
  res.status(404).send({
    status: "false",
    message: "找不到您的頁面"
  })
})



app.use(function (err, req, res, next) {

  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'dev') {
    return resErr.resErrDev(err, res)
  }

  if (err.name === 'ValidationError') {
    err.message = '欄位驗證不正確'
    err.isOperational = true
    return resErr.resErrProd(err, res)
  }
  resErr.resErrProd(err, res)


})

// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
  if (process.env.NODE_ENV === 'dev') {
    console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  }

});


process.on('uncaughtException', err => {
  if (process.env.NODE_ENV == 'dev') {
    console.error('Uncaughted Exception！')
    console.error(err);
  }
  process.exit(1);
});


module.exports = app;
