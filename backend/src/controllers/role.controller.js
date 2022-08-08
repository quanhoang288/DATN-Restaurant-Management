const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { roleService } = require('../services');

const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).send(role);
});

const getRoles = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const result = await roleService.getRoleList({ filters });
  res.send(result);
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleDetail(req.params.id);
  res.send(role);
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRole(req.params.id, req.body);
  res.send(role);
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRole(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole,
};
