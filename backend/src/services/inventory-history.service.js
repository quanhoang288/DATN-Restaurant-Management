const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;

const createInventoryHistory = async (data, option = {}) => {
  const t = await db.sequelize.transaction();
  option.transaction = t;

  console.log('inventory history data: ', data);
  try {
    await Promise.all([
      ...(data.items || []).map(async (item) => {
        const goodInventory = await db.GoodInventory.findOne({
          where: {
            good_id: item.id,
            unit_id: item.unit_id,
            inventory_id: data.target_inventory_id,
          },
        });

        if (!goodInventory) {
          return db.GoodInventory.create(
            {
              good_id: item.id,
              unit_id: item.unit_id,
              inventory_id: data.target_inventory_id,
              quantity: item.quantity,
            },
            option,
          );
        }
        goodInventory.set({ quantity: goodInventory.quantity + item.quantity });

        const updatePromises = [goodInventory.save(option)];
        if (data.type !== 'provider') {
          // subtract quantity from source inventory in case of transfering from 2 inventories
          const sourceGoodInventory = await db.GoodInventory.findOne({
            where: {
              good_id: item.id,
              unit_id: item.unit_id,
              inventory_id: data.source_inventory_id,
            },
          });
          if (sourceGoodInventory.quantity === item.quantity) {
            updatePromises.push(sourceGoodInventory.destroy(option));
          } else {
            sourceGoodInventory.set({
              quantity: Math.max(
                sourceGoodInventory.quantity - item.quantity,
                0,
              ),
            });
            updatePromises.push(sourceGoodInventory.save(option));
          }
        }
        return Promise.all(updatePromises);
      }),
      db.InventoryHistory.create(
        {
          ...data,
          items: (data.items || []).map((item) => ({
            good_id: item.id,
            unit_id: item.unit_id,
            unit_price: item.unit_price,
            quantity: item.quantity,
          })),
        },
        {
          include: [
            {
              association: 'items',
            },
          ],
          ...option,
        },
      ),
    ]);
    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getInventoryHistoryList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [['created_at', 'DESC']];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.InventoryHistory.paginate({
      page: params.page,
      perPage: params.perPage,
      where: query.filter(Op, filters),
      order: sort,
      include: [
        {
          association: 'items',
        },
        {
          association: 'sourceInventory',
        },
        {
          association: 'targetInventory',
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
        association: 'items',
      },
    ],
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.InventoryHistory.findAll(option);
};

const getInventoryHistory = async (inventoryHistoryId) => {
  const inventoryHistory = db.InventoryHistory.findByPk(inventoryHistoryId);
  if (!inventoryHistory) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Inventory history not found');
  }
  return inventoryHistory;
};

const updateInventoryHistory = async (
  inventoryHistoryId,
  data,
  option = {},
) => {
  const inventoryHistory = await getInventoryHistory(inventoryHistoryId);
  inventoryHistory.set(data);
  return inventoryHistory.save(option);
};

const deleteInventoryHistory = async (inventoryHistoryId, option = {}) => {
  const inventoryHistory = await getInventoryHistory(inventoryHistoryId);
  return inventoryHistory.destroy(option);
};

module.exports = {
  createInventoryHistory,
  updateInventoryHistory,
  getInventoryHistory,
  getInventoryHistoryList,
  deleteInventoryHistory,
};
