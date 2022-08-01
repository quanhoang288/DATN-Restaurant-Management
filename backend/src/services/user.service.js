const httpStatus = require('http-status');
const fs = require('fs');
// const path = require('path');

const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const s3Service = require('./s3.service');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, option = {}) => {
  console.log('creating user');
  if (await db.User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const tmpAvatarFile = userBody.avatar;

  const uploadRes = await s3Service.uploadFile(
    tmpAvatarFile.path,
    tmpAvatarFile.filename,
  );
  console.log('upload result: ', uploadRes);
  fs.unlinkSync(tmpAvatarFile.path);
  userBody.avatar = uploadRes.Key;
  return db.User.create(userBody, option);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await db.User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<db.User||null>}
 */
const getUserById = async (id) => db.User.findByPk(id);
/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<db.User>}
 */
const getUserByEmail = async (email) =>
  db.User.findOne({
    where: {
      email,
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
      // {
      //   association: 'customer',
      // },
    ],
  });

const getUserByUsername = async (username) =>
  db.User.findOne({
    where: {
      username,
    },
  });

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<db.User>}
 */
const updateUser = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (
    updateBody.email &&
    (await db.User.isEmailTaken(updateBody.email, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  user.set(updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<void>}
 */
const deleteUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
};
