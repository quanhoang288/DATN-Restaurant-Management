const pick = require('../utils/pick');
const userService = require('./user.service');
const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');

const createStaff = async (data, option = {}) => {
  const userData = pick(data, ['email', 'password']);
  const user = await userService.createUser(userData);
  // create staff
  return db.Staff.create(
    {
      ...data,
      id: user.id,
    },
    {
      ...option,
      include: [
        {
          association: 'roles',
        },
      ],
    },
  );
};

const getStaffList = async (filter, option) => {};

const getStaff = async (staffId) => {
  const staff = await db.Staff.findByPk(staffId, {
    include: [
      {
        association: 'roles',
        through: {
          include: [],
        },
      },
      {
        association: 'user',
      },
    ],
  });
  if (!staff) {
    throw new ApiError(
      Errors.UserNotFound.statusCode,
      Errors.UserNotFound.message,
    );
  }
  return staff;
};

const updateStaff = async (staffId, updateData, option = {}) => {
  const staff = await getStaff(staffId);
  if (updateData.roles) {
    // TODO: update staff role
    delete updateData.roles;
  }
  staff.set(updateData);
  return staff.save(option);
};

const deleteStaff = async (staffId, option = {}) => {
  const staff = await getStaff(staffId);
  return Promise.all([staff.roles.destroy(option), staff.destroy(option)]);
};

module.exports = {
  createStaff,
  getStaffList,
  getStaff,
  updateStaff,
  deleteStaff,
};
