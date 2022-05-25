require('./connections')

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var postsRouter = require('./routes/posts');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/posts', postsRouter);
app.use('/post', postsRouter);

app.use(function (req, res, next) {
  res.status(404).send({
    status: "false",
    message: "找不到您的頁面"
  })
})

const resErrDev = (err,res) => {
  
}

app.use(function (err, req, res, next) {
  // console.log(err.name);
  // res.status(500).json({
  //   "err": err.name
  // })
  err.status = err.status || 500;

  if(process.env.NODE_ENV === 'dev'){
    return resErrDev(err, res)
  }



})

// 未捕捉到的 catch 
process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', reason);
  // 記錄於 log 上
});

process.on('uncaughtException', err => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error('Uncaughted Exception！')

  console.error(err);
  process.exit(1);
});


module.exports = app;
