const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { staffService } = require('../services');

const createStaff = catchAsync(async (req, res) => {
  console.log('creating staff...');
  const data = {
    ...req.body,
    avatar: req.file || {},
  };
  await staffService.createStaff(data);
  return res.status(httpStatus.CREATED).json({
    message: 'Create staff successfully',
  });
});

const getStaffList = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const staffList = await staffService.getStaffList({ filters });
  return res.send(staffList);
});

const getStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  const staffData = await staffService.getStaff(id);
  return res.send(staffData);
});

const updateStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  return res.status(httpStatus.OK).json(staffService.updateStaff(id, req.body));
});

const deleteStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  return res.status(httpStatus.NO_CONTENT).json(staffService.deleteStaff(id));
});

module.exports = {
  createStaff,
  getStaffList,
  getStaff,
  updateStaff,
  deleteStaff,
};
