const errorHandler = (err, req, res, next) => {
  //Log for devs
  // console.log("lmaooo");

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "server error",
    statusCode: err.sql ? 502 : err.statusCode || 500,
  });
};
module.exports = errorHandler;
