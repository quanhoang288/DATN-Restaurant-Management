const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;

const createKitchen = async (data, option = {}) =>
  db.Kitchen.create(data, option);

const updateKitchen = async (kitchenId, data, option = {}) => {
  const kitchen = await db.Kitchen.findByPk(kitchenId);
  if (!kitchen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kitchen not found');
  }
  kitchen.set(data);
  return kitchen.save(option);
};

const getKitchenList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Kitchen.paginate({
      page: params.page,
      perPage: params.perPage,
      where: query.filter(Op, filters),
      order: sort,
      include: [{ association: 'branch' }],
    });

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
    include: [{ association: 'branch' }],
  };

  return db.Kitchen.findAll(option);
};

const getKitchenDetail = async (kitchenId) => {
  const kitchen = db.Kitchen.findByPk(kitchenId);
  if (!kitchen) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Kitchen not found');
  }
  return kitchen;
};

const deleteKitchen = async (kitchenId, option = {}) => {
  const kitchen = await db.Kitchen.findByPk(kitchenId);
  if (!kitchen) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Kitchen not found');
  }
  return kitchen.destroy(option);
};

module.exports = {
  createKitchen,
  updateKitchen,
  getKitchenDetail,
  getKitchenList,
  deleteKitchen,
};
