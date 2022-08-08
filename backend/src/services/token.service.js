const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');

const config = require('../config/config');
const userService = require('./user.service');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateJwtToken = (
  userId,
  expires,
  type,
  secret = config.jwt.secret,
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {Number} userId
 * @param {moment.Moment} expires
 * @param {string} type
 * @returns {Promise<void>}
 */
const saveToken = async (token, userId, expires, type) => {
  const user = await db.User.findByPk(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (type === config.tokenType.REFRESH) {
    user.set({
      refresh_token: token,
      refresh_token_expires_at: expires,
    });
  } else if (type === config.tokenType.EMAIL_VERIFY) {
    user.set({
      email_verify_token: token,
      email_verify_token_expires_at: expires,
    });
  } else if (type === config.tokenType.PASSWORD_RESET) {
    user.set({
      password_reset_token: token,
      password_reset_token_expires_at: expires,
    });
  }

  await user.save();
};

const verifyToken = async (userId, token, type) => {
  const user = await db.User.findByPk(userId);

  if (type === config.tokenType.REFRESH) {
    if (!user.isRefreshTokenValid(token)) {
      throw new Error('Invalid refresh token');
    }
  }
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  console.log('generating auth tokens');
  const accessTokenExpires = moment().add(
    config.jwt.accessExpirationMinutes,
    'minutes',
  );
  const accessToken = generateJwtToken(
    user.id,
    accessTokenExpires,
    config.tokenType.ACCESS,
  );

  const refreshTokenExpires = moment().add(
    config.jwt.refreshExpirationDays,
    'days',
  );
  const refreshToken = uuidv4();
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    config.tokenType.REFRESH,
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const resetRefreshToken = async (userId) => {
  await db.User.update(
    {
      refresh_token: null,
      refresh_token_expires_at: null,
    },
    {
      where: {
        id: userId,
      },
    },
  );
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(
    config.jwt.resetPasswordExpirationMinutes,
    'minutes',
  );
  const resetPasswordToken = generateJwtToken(
    user.id,
    expires,
    config.tokenType.RESET_PASSWORD,
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    config.tokenType.RESET_PASSWORD,
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    config.jwt.verifyEmailExpirationMinutes,
    'minutes',
  );
  const verifyEmailToken = generateJwtToken(user.id, expires);
  await saveToken(
    verifyEmailToken,
    user.id,
    expires,
    config.tokenType.VERIFY_EMAIL,
  );
  return verifyEmailToken;
};

module.exports = {
  generateJwtToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  resetRefreshToken,
};
