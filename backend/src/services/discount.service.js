const query = require('../utils/query');
const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');
const orderService = require('../services/order.service');

const { Op } = db.Sequelize;

const createDiscount = async (data, option = {}) => {
  //   - hóa đơn
  // 	    - giảm giá
  // 		    - discount constraint: from, amount, unit, discount id
  // 	    - tặng món
  // 		    - discount constraint: discount id, from
  // 		    - discount_constraint_good: discount constraint id, good id, quantity
  // 		    - discount_constraint_good_group: discount constraint id, good group id, quantity
  //  - hàng hóa
  // 	  - mua hàng khuyến mại hàng
  // 		  - discount constraint: discount id, amount, unit
  // 		  - discount_constraint_good: discount constraint id, good id, quantity, type (buy/giveaway)
  // 		  - discount_constraint_good_group: tương tự
  // 	  - giảm giá theo SL mua
  // 	  	- discount constraint: discount id, amount, unit,
  // 	  	- discount_constraint_good: discount constraint id, good id, quantity, type (buy)

  const constraints = data.constraints || [];
  delete data.constraints;

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    const discount = await db.Discount.create(data, option);
    await createDiscountConstraints(
      constraints,
      discount.id,
      data.method,
      option,
    );
    t.commit();
    return discount;
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const createDiscountConstraints = (
  data,
  discountId,
  discountMethod,
  option = {},
) => {
  console.log('creating discount constraints', data);
  if (discountMethod === 'invoice-discount') {
    return db.DiscountConstraint.bulkCreate(
      data.map((constraintData) => ({
        ...constraintData,
        discount_id: discountId,
      })),
    );
  }

  return Promise.all(
    data.map(async (constraintData) => {
      const orderItems = constraintData.orderItems || [];
      const orderGroupItems = constraintData.orderGroupItems || [];
      const discountItems = constraintData.discountItems || [];
      const discountGroupItems = constraintData.discountGroupItems || [];
      delete constraintData.orderItems;
      delete constraintData.orderGroupItems;
      delete constraintData.discountItems;
      delete constraintData.discountGroupItems;

      const discountConstraint = await db.DiscountConstraint.create(
        {
          ...constraintData,
          discount_id: discountId,
        },
        option,
      );
      return Promise.all([
        db.DiscountConstraintGood.bulkCreate(
          [
            ...orderItems.map((good) => ({
              good_id: good.id,
              discount_constraint_id: discountConstraint.id,
              is_discount_item: 0,
            })),
            ...discountItems.map((good) => ({
              good_id: good.id,
              discount_constraint_id: discountConstraint.id,
              is_discount_item: 1,
            })),
          ],
          option,
        ),
        db.DiscountConstraintGoodGroup.bulkCreate(
          orderGroupItems.concat(discountGroupItems).map((group) => ({
            good_group_id: group.id,
            discount_id: discountId,
          })),
        ),
      ]);
    }),
  );
};

const getDiscounts = async (params = {}) => {
  const filter = params.filter || {};
  const sort = params.sort || [];

  if (params.page) {
    const items = await db.Discount.paginate({
      page: params.page,
      paginate: params.limit || 10,
      where: query.filter(Op, filter),
      order: sort,
    });

    return query.getPagingData(items, params.page, params.limit);
  }

  const option = {
    where: filter,
    sort,
  };

  return db.Discount.findAll({
    include: [
      {
        association: 'constraints',
      },
    ],
    ...option,
  });
};

const getDiscount = async (discountId) => {
  const discount = await db.Discount.findByPk(discountId, {
    include: [
      {
        association: 'constraints',
        include: [
          {
            association: 'goods',
            through: {
              attributes: ['id', 'is_discount_item'],
            },
            attributes: ['id', 'name'],
          },
          {
            association: 'goodGroups',
            through: {
              attributes: ['id', 'is_discount_item'],
            },
            attributes: ['id', 'name'],
          },
        ],
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
  const constraints = updateData.constraints || [];
  delete updateData.constraints;

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const constraintDeletePromises = (discount.constraints || []).map(
    async (constraint) => {
      await Promise.all([
        constraint.removeGoods(constraint.goods, option),
        constraint.removeGoodGroups(constraint.goodGroups, option),
      ]);
      return constraint.destroy(option);
    },
  );
  discount.set(updateData);
  try {
    await Promise.all(
      constraintDeletePromises,
      createDiscountConstraints(constraints, discount.id, option),
      discount.save(option),
    );
    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const deleteDiscount = async (discountId, option = {}) => {
  const discount = await getDiscount(discountId);
  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await Promise.all(
      (discount.constraints || []).map((constraint) =>
        Promise.all([
          constraint.removeGoods(constraint.goods, option),
          constraint.removeGoodGroups(constraint.goodGroups, option),
        ]),
      ),
    );
    await discount.destroy(option);
    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getAvailableDiscounts = async (orderId) => {
  const now = new Date();
  const order = await orderService.getOrderDetail(orderId);
  const orderItems = order.goods || [];
  const orderTotal = orderItems.reduce(
    (prevSum, item) => prevSum + item.sale_price,
    0,
  );
  let invoiceDiscounts = await db.Discount.findAll({
    include: [
      {
        association: 'constraints',
        where: {
          min_invoice_value: {
            [Op.lte]: orderTotal,
          },
        },
        include: [
          {
            association: 'goods',
            attributes: ['id', 'name', 'sale_price'],
          },
        ],
        required: true,
        // nest: true,
      },
    ],
  });

  invoiceDiscounts = invoiceDiscounts.map((discount) => {
    const constraints = discount.constraints || [];
    const maxConstraint = constraints.reduce(
      (curMax, curConstraint) =>
        curMax && curMax.min_invoice_value > curConstraint.min_invoice_value
          ? curMax
          : curConstraint,
      null,
    );
    return {
      id: discount.id,
      name: discount.name,
      type: discount.type,
      method: discount.method,
      is_auto_applied: discount.is_auto_applied,
      constraint: maxConstraint,
    };
  });

  console.log('invoice discounts', invoiceDiscounts);

  // const goodDiscountQuery = `
  // SELECT * FROM discounts D INNER JOIN discount_constraints DC ON D.id = DC.discount_id
  // WHERE (
  //   EXISTS (
  //     SELECT * FROM discount_constraint_goods DCG
  //     WHERE DCG.discount_constraint_id = DC.id
  //     AND good_id IN (:goodIds)
  //   )
  // )
  // `;

  // // OR EXISTS (
  // // SELECT * FROM discount_constraint_good_groups DCGG
  // // WHERE DCGG.discount_constraint_id = DC.id AND
  // // good_group_id IN (:goodGroupIds)
  // // )

  // const goodDiscounts = await db.sequelize.query(goodDiscountQuery, {
  //   replacements: {
  //     goodIds: order.goods.map((item) => item.id),
  //     // goodGroupIds: Array.from(
  //     //   new Set(order.goods.map((item) => item.good_group_id)),
  //     // ),
  //   },
  //   type: db.sequelize.QueryTypes.SELECT,
  // });

  // console.log('good discounts: ', goodDiscounts);

  return [...invoiceDiscounts];
};

module.exports = {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
  getAvailableDiscounts,
};
