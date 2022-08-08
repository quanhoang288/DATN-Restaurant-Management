const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

const createInventoryHistory = async (data, option = {}) => {
  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await Promise.all([
      ...(data.items || []).map(async (item) => {
        const goodInventory = await db.GoodInventory.findOne({
          where: {
            good_id: item.id,
            unit_id: item.unit_id,
            inventory_id: item.inventory_id,
          },
        });

        if (!goodInventory) {
          return db.GoodInventory.create(
            {
              good_id: item.id,
              unit_id: item.unit_id,
              inventory_id: item.target_inventory_id,
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
              inventory_id: item.source_inventory_id,
            },
          });
          if (sourceGoodInventory.quantity === item.quantity) {
            updatePromises.push(sourceGoodInventory.destroy(option));
          } else {
            sourceGoodInventory.set({
              quantity: sourceGoodInventory.quantity - item.quantity,
            });
            updatePromises.push(sourceGoodInventory.save(option));
          }
        }
        return Promise.all(updatePromises);
      }),
      db.InventoryHistory.create(data, {
        include: [
          {
            association: 'items',
          },
        ],
        ...option,
      }),
    ]);
    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getInventoryHistoryList = async (params = {}) => {
  const where = params.filters || {};
  return db.InventoryHistory.findAll({ where });
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
