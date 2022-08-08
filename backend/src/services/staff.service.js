const pick = require('../utils/pick');
const userService = require('./user.service');
const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');

const createStaff = async (data, option = {}) => {
  const userData = pick(data, [
    'email',
    'password',
    'full_name',
    'address',
    'avatar',
  ]);
  const user = await userService.createUser(userData);
  // create staff
  console.log('creating staff');
  return db.Staff.create(
    {
      status: 'active',
      id: user.id,
    },
    option,
  );
};

const getStaffList = async (params = {}) => {
  const where = params.filters || {};
  const userQueryParams = {};
  const staffQueryParams = {};

  for (const [key, val] of Object.entries(where)) {
    if (['role_id', 'branch_id', 'is_active'].includes(key)) {
      staffQueryParams[key] = val;
    } else {
      userQueryParams[key] = val;
    }
  }

  const staffList = await db.Staff.findAll({
    where: staffQueryParams,
    include: [
      {
        association: 'user',
        where: userQueryParams,
        required: true,
      },
      {
        association: 'role',
        required: true,
      },
    ],
  });

  return staffList.map((staff) => ({
    id: staff.id,
    branch_id: staff.branch_id,
    full_name: staff.user?.full_name,
    email: staff.user?.email,
    address: staff.user?.address,
    phone_number: staff.user?.phone_number ?? null,
    gender: staff.user?.gender ?? null,
    status: staff.status,
    role: staff.role?.name,
  }));
};

const getStaff = async (staffId) => {
  const staff = await db.Staff.findByPk(staffId, {
    include: [
      {
        association: 'role',
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
