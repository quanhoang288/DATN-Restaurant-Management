const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../exceptions/api-error');
const catchAsync = require('../utils/catchAsync');
const { menuService } = require('../services');
const Errors = require('../exceptions/custom-error');

const createMenu = catchAsync(async (req, res) => {
  const menu = await menuService.createMenu(req.body);
  res.status(httpStatus.CREATED).send(menu);
});

const getMenus = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await menuService.getMenus(filter, options);
  res.send(result);
});

const getMenu = catchAsync(async (req, res) => {
  const menu = await menuService.getMenuDetail(req.params.id);
  if (!menu) {
    throw new ApiError(
      Errors.MenuNotFound.statusCode,
      Errors.MenuNotFound.message,
    );
  }
  res.send(menu);
});

const updateMenu = catchAsync(async (req, res) => {
  await menuService.updateMenu(req.params.id, req.body);
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
