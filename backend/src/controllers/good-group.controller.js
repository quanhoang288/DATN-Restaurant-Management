const httpStatus = require('http-status');
const goodGroupService = require('../services/good-group.service');

const createGoodGroup = async (req, res) => {
  await goodGroupService.createGoodGroup(req.body);
  return res.status(httpStatus.OK).json({
    message: 'Create good group successfully',
  });
};

const updateGoodGroup = async (req, res) => {
  await goodGroupService.updateGoodGroup(req.params.id, req.body.data);
  return res.status(httpStatus.OK).json({
    message: 'Update good group successfully',
  });
};

const getGoodGroupList = async (req, res) => {
  const goodGroups = await goodGroupService.getGoodGroupList();
  return res.send(goodGroups);
};

const getGoodGroupDetail = async (req, res) => {
  const goodGroup = await goodGroupService.getGoodGroupDetail(req.params.id);
  return res.status(httpStatus.OK).json({
    data: goodGroup,
  });
};

const deleteGoodGroup = async (req, res) => {
  await goodGroupService.deleteGoodGroup(req.params.id);
  return res.status(httpStatus.OK).json({
    message: 'Delete good group successfully',
  });
};

module.exports = {
  createGoodGroup,
  updateGoodGroup,
  getGoodGroupDetail,
  getGoodGroupList,
  deleteGoodGroup,
};
