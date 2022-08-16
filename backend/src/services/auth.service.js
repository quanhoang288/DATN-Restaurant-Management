const httpStatus = require('http-status');
const tokenService = require('./token.service');
const userService = require('./user.service');
const ApiError = require('../exceptions/api-error');
const config = require('../config/config');
const db = require('../database/models');

const { Op } = db.Sequelize;

const register = async (credentials, option = {}) => {
  const t = await db.sequelize.transaction();
  option.transaction = t;

  let user;

  try {
    user = await userService.createUser(credentials, option);
    await db.Customer.create(
      {
        id: user.id,
      },
      option,
    );
    t.commit();
  } catch (err) {
    t.rollback();
    console.log(err);
    throw err;
  }
  if (user) {
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  }

  // internal error
  throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
};

const loginWithEmailOrPhoneNumber = async (identifier, password) => {
  try {
    const user = await db.User.findOne({
      where: {
        [Op.or]: [
          {
            email: identifier,
          },
          {
            phone_number: identifier,
          },
        ],
      },
      include: [
        {
          association: 'staff',
          include: [
            {
              association: 'role',
            },
          ],
        },
        {
          association: 'customer',
        },
      ],
    });

    if (!user || !(await user.isPasswordMatch(password))) {
      console.log('authentication failed');
      throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect credentials');
    }

    const tokens = await tokenService.generateAuthTokens(user);

    return { user, tokens };
  } catch (err) {
    console.log(err);
  }
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 */
const loginWithEmail = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  console.log('user: ', user);
  if (!user || !(await user.isPasswordMatch(password))) {
    console.log('authentication failed');
    throw new ApiError(httpStatus.BAD_REQUEST, 'Incorrect email or password');
  }
  return user;
};

const loginWithPhoneNumber = async (phoneNumber, password) => {
  const user = await db.User.findOne({
    where: {
      phone_number: phoneNumber,
    },
  });
  console.log('user: ', user);

  if (!user || !(await user.isPasswordMatch(password))) {
    console.log('authentication failed');
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Incorrect phone number or password',
    );
  }
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async ({
  user_id: userId,
  refresh_token: refreshToken,
}) => {
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
  loginWithEmail,
  loginWithPhoneNumber,
  loginWithEmailOrPhoneNumber,
  refreshAuth,
  resetPassword,
  verifyEmail,
  register,
};
