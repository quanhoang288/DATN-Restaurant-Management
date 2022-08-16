const httpStatus = require('http-status');
const ApiError = require('../exceptions/api-error');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');
const Errors = require('../exceptions/custom-error');
const convertToNumber = require('../utils/numberConverter');

const createMenu = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
    categories: JSON.parse(req.body.categories).value,
  };
  if (req.file) {
    data.image = req.file;
  }
  const menu = await menuService.createMenu(convertToNumber(data));
  res.status(httpStatus.CREATED).send(menu);
});

const getMenus = catchAsync(async (req, res) => {
  const filters = JSON.parse(req.query.filters || '{}');
  const result = await menuService.getMenus({ ...req.query, filters });
  res.send(result);
});

const getMenu = catchAsync(async (req, res) => {
  const menu = await menuService.getMenu(req.params.id);
  if (!menu) {
    throw new ApiError(
      Errors.MenuNotFound.statusCode,
      Errors.MenuNotFound.message,
    );
  }
  res.send(menu);
});

const updateMenu = catchAsync(async (req, res) => {
  const data = {
    ...req.body,
    categories: JSON.parse(req.body.categories).value,
  };
  if (req.file) {
    data.image = req.file;
  }
  await menuService.updateMenu(req.params.id, data);
  return res.status(httpStatus.OK).json({
    message: 'Update menu successfully',
  });
});

const deleteMenu = catchAsync(async (req, res) => {
  await menuService.deleteMenu(req.params.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getMenuCategory = catchAsync(async (req, res) => {
  const category = await menuService.getMenuCategory(
    req.params.id,
    req.params.categoryId,
  );
  return res.status(httpStatus.OK).send(category);
});

module.exports = {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
  getMenuCategory,
};
