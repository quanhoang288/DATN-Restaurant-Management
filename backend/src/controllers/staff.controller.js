const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { staffService } = require('../services');

const createStaff = catchAsync(async (req, res) => {
  await staffService.createStaff(req.body);
  return res.status(httpStatus.CREATED).json({
    message: 'Create staff successfully',
  });
});

const getStaffList = catchAsync(async (req, res) => {
  const staffList = await staffService.getStaffList();
  return res.send(staffList);
});

const getStaff = catchAsync(async (req, res) => {
  const { id } = req.params;
  return res.status(httpStatus.OK).json(staffService.getStaff(id));
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
