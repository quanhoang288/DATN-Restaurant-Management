const Joi = require('joi');
const fs = require('fs');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../exceptions/api-error');

const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object, { allowUnknown: true });

  if (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    const errorMessage = error.details
      .map((details) => details.message)
      .join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = validate;
