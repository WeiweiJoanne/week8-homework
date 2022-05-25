

function handleSuccess(res, data) {
  res.status(200).send({
    "status": "success",
    "data": data
  })
  res.end();
}
module.exports = handleSuccess;
