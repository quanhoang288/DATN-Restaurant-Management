const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;

const getCustomers = async (params = {}) => {
  const where = params.filters || {};
  const sort = params.sort || [];
  console.log(params);

  if (params.page) {
    const items = await db.Customer.paginate({
      page: params.page || 1,
      perPage: params.perPage || 10,
      order: sort,
      include: [
        {
          association: 'user',
          where: query.filter(Op, where),
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
      data: paginationRes.data.map((customer) => customer.user),
    };
  }

  const option = {
    sort,
    include: [
      {
        association: 'user',
        where: query.filter(Op, where),
        required: true,
      },
    ],
  };

  const customers = await db.Customer.findAll(option);

  return customers.map((customer) => customer.user);
};

const getCustomer = async (customerId) => {
  const customer = await db.Customer.findByPk(customerId, {
    include: [
      {
        association: 'user',
      },
    ],
  });
  if (!customer) {
    throw new ApiError(
      Errors.UserNotFound.statusCode,
      Errors.UserNotFound.message,
    );
  }
  return customer;
};

module.exports = {
  getCustomers,
  getCustomer,
};
