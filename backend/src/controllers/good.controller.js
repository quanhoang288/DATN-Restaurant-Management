const httpStatus = require('http-status');
const goodService = require('../services/good.service');

const createGood = async (req, res) => {
  const data = req.body;
  if (data.units) {
    data.units = JSON.parse(data.units).value;
  }
  if (data.components) {
    data.components = JSON.parse(data.components).value;
  }
  if (req.file) {
    data.image = req.file;
  }
  await goodService.createGood(data);
  return res.status(httpStatus.OK).json({
    message: 'Create good successfully',
  });
};

const importGoods = async (req, res) => {
  await goodService.importGoods(req.file);
  return res.status(httpStatus.OK).json({
    message: 'Imported goods successfully',
  });
};

const getGoodList = async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const goods = await goodService.getGoodList({ ...req.query, filters });
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
  const data = req.body;
  if (data.units) {
    data.units = JSON.parse(data.units).value;
  }
  if (data.components) {
    data.components = JSON.parse(data.components).value;
  }
  if (req.file) {
    data.image = req.file;
  }
  await goodService.updateGood(req.params.id, data);
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
  importGoods,
  getGoodList,
  getOptions,
  getGoodDetail,
  updateGood,
  deleteGood,
};
