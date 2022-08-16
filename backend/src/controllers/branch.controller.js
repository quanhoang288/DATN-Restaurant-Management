const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { branchService } = require('../services');

const createBranch = catchAsync(async (req, res) => {
  const branch = await branchService.createBranch(req.body);
  res.status(httpStatus.CREATED).send(branch);
});

const getBranches = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const branches = await branchService.getBranchList({ ...req.query, filters });
  res.send(branches);
});

const getBranch = catchAsync(async (req, res) => {
  const branch = await branchService.getBranchDetail(req.params.id);
  res.send(branch);
});

const updateBranch = catchAsync(async (req, res) => {
  await branchService.updateBranch(req.params.id, req.body);
  res.send('Update branch successfully');
});

const deleteBranch = catchAsync(async (req, res) => {
  await branchService.deleteBranch(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createBranch,
  getBranches,
  getBranch,
  updateBranch,
  deleteBranch,
};
