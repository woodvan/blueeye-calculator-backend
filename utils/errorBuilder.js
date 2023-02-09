module.exports = function (message, status) {
  const error = new Error(message);
  error.httpStatus = status || 500;
  return error;
};
