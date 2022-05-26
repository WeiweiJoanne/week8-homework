const appErr = (httpStatusCode, msg,next) => {
  const error = new Error(msg);
  error.statusCode = httpStatusCode
  error.isOperational = true
  next(error)
}

module.exports = appErr