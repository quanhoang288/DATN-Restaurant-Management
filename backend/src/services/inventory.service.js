const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;

const createInventory = async (data, option = {}) =>
  db.Inventory.create(data, option);

const getInventoryList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Inventory.paginate({
      page: params.page,
      perPage: params.perPage,
      where: query.filter(Op, filters),
      order: sort,
      include: [
        {
          association: 'branch',
        },
      ],
    });

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
    include: [
      {
        association: 'branch',
      },
    ],
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Inventory.findAll(option);
};

const getInventoryDetail = async (inventoryId) => {
  const inventory = await db.Inventory.findByPk(inventoryId, {
    include: [
      {
        association: 'branch',
      },
      {
        association: 'inventoryGoods',
        include: [
          {
            association: 'good',
            attributes: ['name'],
          },
          {
            association: 'unit',
            attributes: ['name'],
          },
        ],
      },
    ],
  });
  if (!inventory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory not found');
  }
  console.log(inventory);
  return inventory;
};

const updateInventory = async (inventoryId, data, option = {}) => {
  const inventory = await getInventoryDetail(inventoryId);
  inventory.set(data);
  return inventory.save(option);
};

const deleteInventory = async (inventoryId, option = {}) => {
  const inventory = await getInventoryDetail(inventoryId);
  return inventory.destroy(option);
};

module.exports = {
  createInventory,
  updateInventory,
  getInventoryDetail,
  getInventoryList,
  deleteInventory,
};
