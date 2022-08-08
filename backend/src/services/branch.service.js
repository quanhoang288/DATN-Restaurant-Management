const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const query = require('../utils/query');

const { Op } = db.Sequelize;
const createBranch = async (data, option = {}) =>
  db.Branch.create(data, option);

const getBranchList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Branch.paginate({
      page: params.page,
      perPage: params.perPage,
      where: query.filter(Op, filters),
      order: sort,
    });

    console.log('items');

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Branch.findAll(option);
};

const getBranchDetail = async (BranchId) => {
  const branch = db.Branch.findByPk(BranchId);
  if (!branch) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Branch not found');
  }
  return branch;
};

const updateBranch = async (branchId, data, option = {}) => {
  const branch = await getBranchDetail(branchId);
  branch.set(data);
  return branch.save(option);
};

const deleteBranch = async (branchId, option = {}) => {
  const branch = await getBranchDetail(branchId);
  return branch.destroy(option);
};

module.exports = {
  createBranch,
  updateBranch,
  getBranchDetail,
  getBranchList,
  deleteBranch,
};
