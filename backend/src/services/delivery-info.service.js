const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;
const createDeliveryInfo = async (data, option = {}) => {
  console.log(data);
  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    if (data.is_default) {
      await db.DeliveryInfo.update(
        { is_default: 0 },
        {
          where: {
            customer_id: data.customer_id,
            is_default: 1,
          },
        },
      );
    }
    await db.DeliveryInfo.create(data, option);

    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getDeliveryInfos = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.DeliveryInfo.paginate({
      page: params.page,
      perPage: params.perPage,
      where: query.filter(Op, filters),
      order: sort,
    });

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
  };

  return db.DeliveryInfo.findAll(option);
};

const getDeliveryInfo = async (deliveryInfoId) => {
  const deliveryInfo = db.DeliveryInfo.findByPk(deliveryInfoId);
  if (!deliveryInfo) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Delivery info not found');
  }
  return deliveryInfo;
};

const updateDeliveryInfo = async (deliveryInfoId, data, option = {}) => {
  const deliveryInfo = await getDeliveryInfo(deliveryInfoId);
  deliveryInfo.set(data);
  return deliveryInfo.save(option);
};

const deleteDeliveryInfo = async (deliveryInfoId, option = {}) => {
  const deliveryInfo = await getDeliveryInfo(deliveryInfoId);
  return deliveryInfo.destroy(option);
};

module.exports = {
  createDeliveryInfo,
  updateDeliveryInfo,
  getDeliveryInfo,
  getDeliveryInfos,
  deleteDeliveryInfo,
};
