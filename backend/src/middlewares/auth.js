const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../exceptions/api-error');
const { jwtStrategy } = require('../config/passport');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  req.user = user;

  resolve();
};

passport.use(jwtStrategy);

const auth = () => async (req, res, next) =>
  new Promise((resolve, reject) => {
    passport.authenticate(
      'jwt',
      { session: false },
      verifyCallback(req, resolve, reject),
    )(req, res, next);
  })
    .then(() => next())
    .catch((err) => {
      console.log(err);
      next(err);
    });

module.exports = auth;
