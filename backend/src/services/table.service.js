const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;
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

const getTableList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Table.paginate(
      {
        page: params.page,
        perPage: params.perPage,
      },
      {
        where: query.filter(Op, filters),
        order: sort,
        include: [{ association: 'branch' }, { association: 'reservations' }],
      },
    );

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
    include: [{ association: 'branch' }, { association: 'reservations' }],
  };

  return db.Table.findAll(option);
};

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
