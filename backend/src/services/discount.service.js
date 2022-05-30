const pick = require('../utils/pick');
const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');

const createDiscount = async (data, option = {}) => {
  if (data.constraints) {
    // TODO: save contraints
    delete data.constraints;
  }
  return db.Discount.create(data, {
    ...option,
    include: [
      {
        association: 'constraints',
      },
    ],
  });
};

const getDiscounts = async (filter, option) => {
  // TODO: pagination and filers
  console.log('todo');
  return db.Discount.findAll({});
};

const getDiscount = async (discountId) => {
  const discount = await db.Discount.findByPk(discountId, {
    include: [
      {
        association: 'constraints',
        through: {
          include: [],
        },
      },
    ],
  });
  if (!discount) {
    throw new ApiError(
      Errors.DiscountNotFound.statusCode,
      Errors.DiscountNotFound.message,
    );
  }
  return discount;
};

const updateDiscount = async (discountId, updateData, option = {}) => {
  const discount = await getDiscount(discountId);
  if (updateData.contraints) {
    // TODO: update constraints
    delete updateData.constraints;
  }
  discount.set(updateData);
  return discount.save(option);
};

const deleteDiscount = async (discountId, option = {}) => {
  const discount = await getDiscount(discountId);
  await Promise.all(
    (discount.constraints || []).map((constraint) =>
      constraint.destroy(option),
    ),
  );
  return discount.destroy(option);
};

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
