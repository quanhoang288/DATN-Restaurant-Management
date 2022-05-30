const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const createTable = async (data, option = {}) => {
  const duplicateNameTable = await db.Table.findOne({ name: data.name });
  if (duplicateNameTable) {
    console.log('duplicate: ', duplicateNameTable);
    throw new ApiError(
      Errors.DuplicateTableName.statusCode,
      Errors.DuplicateTableName.message,
    );
  }
  return db.Table.create(data, option);
};

const updateTable = async (tableId, data, option = {}) => {
  const table = await db.Table.findByPk(tableId);
  if (!table) {
    throw new ApiError(
      Errors.TableNotFound.statusCode,
      Errors.TableNotFound.message,
    );
  }
  table.set(data);
  return table.save(option);
};

const getTableList = async () => db.Table.findAll({});

const getTableDetail = async (tableId) => {
  console.log(tableId);
  const table = await db.Table.findByPk(tableId);
  if (!table) {
    throw new ApiError(
      Errors.TableNotFound.statusCode,
      Errors.TableNotFound.message,
    );
  }
  return table;
};

const deleteTable = async (tableId, option = {}) => {
  const table = await db.Table.findByPk(tableId);
  if (!table) {
    throw new ApiError(
      Errors.TableNotFound.statusCode,
      Errors.TableNotFound.message,
    );
  }
  return table.destroy(option);
};

module.exports = {
  createTable,
  updateTable,
  getTableDetail,
  getTableList,
  deleteTable,
};
