class ApiError extends Error {
  constructor(statusCode, message, code = null, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
