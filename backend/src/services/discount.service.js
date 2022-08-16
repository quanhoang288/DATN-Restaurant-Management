const fs = require('fs');
const query = require('../utils/query');
const db = require('../database/models');
const Errors = require('../exceptions/custom-error');
const ApiError = require('../exceptions/api-error');
const orderService = require('./order.service');
const s3Service = require('./s3.service');

const { Op } = db.Sequelize;

const createDiscount = async (data, option = {}) => {
  console.log('discount data: ', data);
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

  if (data.image) {
    const tmpImageFile = data.image;

    const uploadRes = await s3Service.uploadFile(
      tmpImageFile.path,
      tmpImageFile.filename,
    );
    console.log('upload result: ', uploadRes);
    fs.unlinkSync(tmpImageFile.path);
    data.image = uploadRes.Key;
  }

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    const discount = await db.Discount.create(data, {
      ...option,
      include: [
        {
          association: 'timeSlots',
        },
      ],
    });

    console.log('discount: ', discount);

    await createDiscountConstraints(
      constraints,
      discount.id,
      data.method,
      option,
    );
    console.log('ok');
    await t.commit();
    return discount;
  } catch (err) {
    console.log(err);
    t.rollback();
    throw err;
  }
};

const createDiscountConstraints = async (
  data,
  discountId,
  discountMethod,
  option = {},
) => {
  console.log('creating discount constraints', data);
  if (discountMethod === 'invoice-discount') {
    const constraints = await db.DiscountConstraint.bulkCreate(
      data.map((constraintData) => ({
        ...constraintData,
        discount_id: discountId,
      })),
      option,
    );
    console.log(constraints);
    return constraints;
  }

  return Promise.all(
    data.map(async (constraintData) => {
      const orderItems = constraintData.orderItems || [];
      const discountItems = constraintData.discountItems || [];
      delete constraintData.orderItems;
      delete constraintData.discountItems;

      const discountConstraint = await db.DiscountConstraint.create(
        {
          ...constraintData,
          discount_id: discountId,
        },
        option,
      );
      console.log('constraint', discountConstraint);
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
      ]);
    }),
  );
};

const getDiscounts = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [['created_at', 'DESC']];

  try {
    if (params.page) {
      const items = await db.Discount.paginate({
        page: params.page,
        perPage: params.perPage || 10,
        where: query.filter(Op, filters),
        order: sort,
      });

      return query.getPagingData(items, params.page, params.perPage);
    }
  } catch (err) {
    console.log(err);
  }

  const option = {
    where: filters,
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
  console.log('update data: ', updateData);
  const discount = await getDiscount(discountId);
  const constraints = updateData.constraints || [];
  delete updateData.constraints;
  discount.set(updateData);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const discountConstraints = discount.constraints || [];

  const newConstraints = constraints.filter((constraint) => !constraint.id);
  const constraintsToUpdate = discountConstraints.filter((constraint) =>
    constraints.some((c) => c.id === constraint.id),
  );
  const constraintsToDelete = discountConstraints.filter(
    (constraint) => !constraints.some((c) => c.id === constraint.id),
  );

  const updatePromises = [discount.save(option)];

  if (newConstraints.length) {
    updatePromises.push(
      createDiscountConstraints(constraints, discount.id, option),
    );
  }

  if (constraintsToUpdate.length) {
    updatePromises.push(
      Promise.all(
        constraintsToUpdate.map((constraint) => {
          const data = constraints.find((c) => c.id === constraint.id);
          if (data) {
            constraint.set(data);
          }
          return constraint.save(option);
        }),
      ),
    );
  }

  if (constraintsToDelete.length) {
    updatePromises.push(
      constraintsToDelete.map(async (constraint) => {
        await Promise.all([constraint.removeGoods(constraint.goods, option)]);
        return constraint.destroy(option);
      }),
    );
  }

  try {
    await Promise.all(updatePromises);
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
      (discount.constraints || []).map(async (constraint) => {
        await Promise.all([constraint.removeGoods(constraint.goods, option)]);
        return constraint.destroy(option);
      }),
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
    (prevSum, item) =>
      prevSum + item.sale_price * (item.OrderDetail?.quantity || 1),
    0,
  );
  let invoiceDiscounts = await db.Discount.findAll({
    where: {
      is_active: 1,
    },
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
