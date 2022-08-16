const pick = require('../utils/pick');
const userService = require('./user.service');
const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;

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

  const sort = params.sort || [];

  if (params.page) {
    const items = await db.Staff.paginate({
      page: params.page || 1,
      perPage: params.perPage || 10,
      where: query.filter(Op, staffQueryParams),
      order: sort,
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

    const paginationRes = query.getPagingData(
      items,
      params.page,
      params.perPage,
    );
    return {
      ...paginationRes,
      data: paginationRes.data.map((staff) => ({
        id: staff.id,
        branch_id: staff.branch_id,
        full_name: staff.user?.full_name,
        email: staff.user?.email,
        address: staff.user?.address,
        phone_number: staff.user?.phone_number ?? null,
        gender: staff.user?.gender ?? null,
        status: staff.status,
        role: staff.role?.name,
      })),
    };
  }

  const option = {
    where: query.filter(Op, staffQueryParams),
    sort,
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
  };

  const staffList = await db.Staff.findAll(option);

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

  console.log('staff: ', staff);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await db.User.destroy({ where: { id: staffId } });
    await staff.destroy(option);
    t.commit();
  } catch (error) {
    console.log(error);
    t.rollback();
    throw error;
  }
};

module.exports = {
  createStaff,
  getStaffList,
  getStaff,
  updateStaff,
  deleteStaff,
};
