const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db;

const createGoodGroup = async (data, option = {}) => {
  const duplicateGroup = await db.GoodGroup.findOne({
    name: data.name,
  });
  if (duplicateGroup) {
    throw new ApiError(
      Errors.DuplicateGoodGroupName.statusCode,
      Errors.DuplicateGoodGroupName.message,
    );
  }
  return db.GoodGroup.create(data, option);
};

const updateGoodGroup = async (id, data, option = {}) => {
  const duplicateGroup = await db.GoodGroup.findOne({
    name: data.name,
    id: {
      [Op.ne]: id || null,
    },
  });
  if (duplicateGroup) {
    throw new ApiError(
      Errors.DuplicateGoodGroupName.statusCode,
      Errors.DuplicateGoodGroupName.message,
    );
  }
  const goodGroup = await db.GoodGroup.findByPk(id);
  if (!goodGroup) {
    throw new ApiError(
      Errors.GoodGroupNotFound.statusCode,
      Errors.GoodGroupNotFound.message,
    );
  }
  goodGroup.set(data);
  return goodGroup.save(option);
};

const getGoodGroupList = async () => {};

const getGoodGroupDetail = async (id) => {
  const goodGroup = await db.GoodGroup.findByPk(id);
  if (!goodGroup) {
    const { statusCode, message } = Errors.GoodGroupNotFound;
    throw new ApiError(statusCode, message);
  }
  return goodGroup;
};

const deleteGoodGroup = async (id, option = {}) => {
  const goodGroup = await db.GoodGroup.findByPk(id);
  if (!goodGroup) {
    const { statusCode, message } = Errors.GoodGroupNotFound;
    throw new ApiError(statusCode, message);
  }
  return goodGroup.destroy(option);
};

module.exports = {
  createGoodGroup,
  getGoodGroupDetail,
  getGoodGroupList,
  updateGoodGroup,
  deleteGoodGroup,
};
