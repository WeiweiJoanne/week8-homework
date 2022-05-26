const handErrAsync = function handErrAsync(fun) {
  return (req, res, next) => {
    fun(req, res, next).catch(
      function (error) {
        next(error);
      }
    );
  }
}


module.exports = handErrAsync;