module.exports = {
  notFound: (req, res, next) => {
    const error = new Error("Not Found");
    error.httpStatus = 404;
    next(error);
  },
  errorCatch: (err, req, res, _next) => {
    const statusCode = err.httpStatus ? err.httpStatus : 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
    });
  },
};
