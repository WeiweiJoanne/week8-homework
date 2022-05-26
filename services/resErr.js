const resErr = {
  resErrDev(err, res) {
    res.status(err.statusCode).send({
      message: err.message,
      statusCode: err.statusCode,
      error: err,
      stack: err.stack
    })
  },
  resErrProd(err, res) {
    if (err.isOperational){
      res.status(err.statusCode).send({
        status: "false",
        message: err.message,
      })
    }else{
      res.status(500).json({
        status: 'error',
        message: '系統錯誤，請恰系統管理員'
      });
    }
  },
}

module.exports = resErr