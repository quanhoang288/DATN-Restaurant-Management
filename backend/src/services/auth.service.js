const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const ApiError = require('../exceptions/api-error');
const config = require('../config/config');
const db = require('../database/models');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return user;
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (userId, refreshToken) => {
  try {
    const user = await tokenService.verifyToken(
      userId,
      refreshToken,
      config.tokenType.REFRESH,
    );
    return tokenService.generateAuthTokens(user);
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (userId, resetPasswordToken, newPassword) => {
  const user = await userService.getUserById(userId);
  await tokenService.verifyToken(
    userId,
    resetPasswordToken,
    config.tokenType.PASSWORD_RESET,
  );
  await userService.updateUserById(user.id, {
    password: newPassword,
    password_reset_token: null,
    password_reset_token_expires_at: null,
  });
};

/**
 * Verify email
 * @param {string} userId
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (userId, verifyEmailToken) => {
  const user = await userService.getUserById(userId);
  await tokenService.verifyToken(
    userId,
    verifyEmailToken,
    config.tokenType.EMAIL_VERIFY,
  );
  await userService.updateUserById(user.id, {
    email_verified: true,
    email_verify_token: null,
    email_verify_token_expires_at: null,
  });
};

module.exports = {
  loginUserWithEmailAndPassword,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
