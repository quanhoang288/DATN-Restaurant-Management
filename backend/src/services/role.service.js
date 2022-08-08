const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');

const createRole = async (data, option = {}) => db.Role.create(data, option);

const updateRole = async (roleId, data, option = {}) => {
  const role = await getRoleDetail(roleId);
  role.set(data);
  return role.save(option);
};

const getRoleList = async (params = {}) => {
  const where = params.filters || {};
  return db.Role.findAll({ where });
};

const getRoleDetail = async (roleId) => {
  const role = await db.Role.findByPk(roleId);
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Role not found');
  }
  return role;
};

const deleteRole = async (roleId, option = {}) => {
  const role = await getRoleDetail(roleId);
  return role.destroy(option);
};

module.exports = {
  createRole,
  updateRole,
  getRoleDetail,
  getRoleList,
  deleteRole,
};
