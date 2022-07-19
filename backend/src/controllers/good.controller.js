const httpStatus = require('http-status');
const goodService = require('../services/good.service');

const createGood = async (req, res) => {
  await goodService.createGood(req.body);
  return res.status(httpStatus.OK).json({
    message: 'Create good successfully',
  });
};

const getGoodList = async (req, res) => {
  const params = req.query || {};
  const goods = await goodService.getGoodList(params);
  return res.status(httpStatus.OK).send(goods);
};

const getOptions = async (req, res) => {
  const keyword = req.query.name || '';
  const options = await goodService.getGoodOptions(keyword);
  return res.status(httpStatus.OK).send(options);
};

const getGoodDetail = async (req, res) => {
  const good = await goodService.getGoodDetail(req.params.id);
  return res.status(httpStatus.OK).send(good);
};

const updateGood = async (req, res) => {
  await goodService.updateGood(req.params.id, req.body);
  return res.status(httpStatus.OK).json({
    message: 'Update good successfully',
  });
};

const deleteGood = async (req, res) => {
  await goodService.deleteGood(req.params.id);
  return res.status(httpStatus.OK).json({
    message: 'Delete good successfully',
  });
};

module.exports = {
  createGood,
  getGoodList,
  getOptions,
  getGoodDetail,
  updateGood,
  deleteGood,
};
