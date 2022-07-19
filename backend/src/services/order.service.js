const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db.Sequelize;

const createOrder = async (data, option = {}) => {
  if (data.table) {
    const reservationTable = await db.ReservationTable.findOne({
      where: {
        table_id: data.table,
      },
      include: [
        {
          association: 'reservation',
          attributes: [],
          where: {
            status: 'serving',
          },
          required: true,
        },
      ],
    });

    if (!reservationTable) {
      throw new ApiError(
        Errors.TableNotReserved.statusCode,
        Errors.TableNotReserved.message,
      );
    }

    const existingOrder = await db.Order.findOne({
      where: {
        reservation_table_id: reservationTable.id,
      },
    });

    if (existingOrder) {
      throw new ApiError(
        Errors.OrderAlreadyCreated.message,
        Errors.OrderAlreadyCreated.statusCode,
      );
    }
    data.reservation_table_id = reservationTable.id;
    delete data.table;
  }

  if (data.kitchens && Array.isArray(data.kitchens)) {
    const kitchens = data.kitchens.length
      ? data.kitchens
      : (await db.Kitchen.findAll()).map((kitchen) => kitchen.id);
    data.kitchenOrders = kitchens.map((kitchen) => ({ kitchen_id: kitchen }));
    delete data.kitchens;
  }

  const discountData = data.discounts || [];
  delete data.discounts;

  if (data.payment) {
    // TODO: create payment info
  }

  const t = await db.sequelize.transaction();
  option.transaction = t;
  try {
    const order = await db.Order.create(data, {
      ...option,
      include: [
        {
          association: 'details',
          ...option,
        },
        {
          association: 'kitchenOrders',
          ...option,
        },
      ],
    });

    if (discountData.length) {
      await db.OrderDiscount.bulkCreate(
        discountData.map((discount) => ({
          order_id: order.id,
          discount_constraint_id: discount.discount_constraint_id,
        })),
      );
    }

    await t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getOrderList = async () => {
  // todo: filters and pagination
  console.log('getting orders');
  return db.Order.findAll();
};

const getOrderDetail = async (orderId) => {
  const order = db.Order.findOne({
    where: {
      id: orderId,
    },
    include: [
      {
        association: 'goods',
        attributes: ['id', 'name', 'sale_price'],
        through: {
          attributes: ['id', 'quantity', 'finished_quantity', 'status'],
        },
      },
      {
        association: 'reservationTable',
        include: [
          {
            association: 'table',
            attributes: ['id', 'name'],
          },
        ],
      },
      {
        association: 'orderDiscounts',
        include: [
          {
            association: 'discountConstraint',
            include: [
              {
                association: 'discount',
                attributes: ['id', 'name', 'type', 'method'],
              },
            ],
          },
          {
            association: 'discountItems',
            through: {
              attributes: [],
            },
            attributes: ['id', 'name', 'sale_price'],
          },
        ],
      },
    ],
  });
  if (!order) {
    throw new ApiError(
      Errors.OrderNotFound.statusCode,
      Errors.OrderNotFound.message,
    );
  }
  return order;
};

const updateOrder = async (orderId, data, option = {}) => {
  if (data.table) {
    const reservationTable = await db.ReservationTable.findOne({
      where: {
        table_id: data.table,
      },
      include: [
        {
          association: 'reservation',
          attributes: [],
          where: {
            status: 'serving',
          },
          required: true,
        },
      ],
    });

    if (!reservationTable) {
      throw new ApiError(
        Errors.TableNotReserved.statusCode,
        Errors.TableNotReserved.message,
      );
    }

    const existingOrder = await db.Order.findOne({
      where: {
        reservation_table_id: reservationTable.id,
      },
    });

    if (existingOrder) {
      throw new ApiError(
        Errors.OrderAlreadyCreated.message,
        Errors.OrderAlreadyCreated.statusCode,
      );
    }

    data.reservation_table_id = reservationTable.id;
    delete data.table;
  }

  const order = await getOrderDetail(orderId);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const detailData = data.details || [];
  const orderItems = order.goods || [];
  delete data.details;

  const newGoods = detailData.filter(
    (good) => !orderItems.some((item) => item.id === good.good_id),
  );
  const goodsToUpdate = detailData.filter((good) =>
    orderItems.some((item) => item.id === good.good_id),
  );
  const goodsToRemove = orderItems.filter(
    (item) => !detailData.some((good) => good.good_id === item.id),
  );

  const discountData = data.discounts || [];
  delete data.discounts;

  const newDiscounts = discountData.filter(
    (discount) =>
      !order.orderDiscounts.some(
        (orderDiscount) =>
          orderDiscount.discount_constraint_id === discount.constraint.id,
      ),
  );
  const discountsToUpdate = discountData.filter(
    (discount) =>
      !['invoice-discount', 'good-discount'].includes(discount.method) &&
      order.orderDiscounts.some(
        (orderDiscount) =>
          orderDiscount.discount_constraint_id === discount.constraint.id,
      ),
  );
  const discountsToRemove = order.orderDiscounts.filter(
    (orderDiscount) =>
      !discountData.some(
        (discount) =>
          discount.constraint.id === orderDiscount.discount_constraint_id,
      ),
  );

  console.log('new discounts: ', newDiscounts);
  console.log('update discounts: ', discountsToUpdate);
  console.log('remove discounts: ', discountsToRemove);

  order.set(data);

  try {
    await Promise.all([
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve) => {
        const orderDiscountIds = discountsToRemove.map(
          (orderDiscount) => orderDiscount.id,
        );
        await db.OrderDiscountGood.destroy({
          where: {
            order_discount_id: {
              [Op.in]: orderDiscountIds,
            },
          },
        });
        await db.OrderDiscount.destroy({
          where: {
            id: {
              [Op.in]: orderDiscountIds,
            },
          },
          ...option,
        });
        resolve();
      }),
      Promise.all(
        newDiscounts.map(
          (discount) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve) => {
              console.log('order id: ', order.id);
              const orderDiscount = await db.OrderDiscount.create(
                {
                  order_id: order.id,
                  discount_constraint_id: discount.constraint.id,
                },
                option,
              );
              console.log('new order discount: ', orderDiscount);
              if (Array.isArray(discount.discountItems)) {
                await db.OrderDiscountGood.bulkCreate(
                  discount.discountItems.map((item) => ({
                    order_discount_id: orderDiscount.id,
                    good_id: item.id,
                  })),
                  option,
                );
              }
              resolve();
            }),
        ),
      ),
      Promise.all(
        // eslint-disable-next-line no-async-promise-executor
        discountsToUpdate.map(
          (discount) =>
            // eslint-disable-next-line no-async-promise-executor
            new Promise(async (resolve) => {
              const orderDiscount = await db.OrderDiscount.findOne({
                where: {
                  order_id: orderId,
                  discount_constraint_id: discount.constraint.id,
                },
                include: [
                  {
                    association: 'discountGoods',
                  },
                ],
              });
              const discountItems = discount.discountItems || [];
              const newItems = discountItems.filter(
                (item) =>
                  !orderDiscount.discountGoods.some(
                    (good) => good.good_id === item.id,
                  ),
              );
              const itemsToRemove = orderDiscount.discountGoods.filter(
                (good) =>
                  !discountItems.some((item) => item.id === good.good_id),
              );
              await orderDiscount.removeDiscountGoods(itemsToRemove, option);
              await db.OrderDiscountGood.bulkCreate(
                newItems.map((item) => ({
                  order_discount_id: orderDiscount.id,
                  good_id: item.id,
                })),
                option,
              );

              resolve();
            }),
        ),
      ),
      order.removeGoods(goodsToRemove, option),
      db.OrderDetail.bulkCreate(
        newGoods.map((good) => ({ ...good, order_id: order.id })),
        option,
      ),
      goodsToUpdate.map((good) =>
        db.OrderDetail.update(good, {
          where: {
            good_id: good.good_id,
            order_id: order.id,
          },
          ...option,
        }),
      ),
      order.save(option),
    ]);

    await t.commit();
  } catch (err) {
    console.log(err);
    t.rollback();
    throw err;
  }
};

const deleteOrder = async (orderId, option = {}) => {
  const order = await db.Order.findByPk(orderId, {
    include: [
      {
        association: 'goods',
      },
      {
        association: 'kitchenOrders',
      },
    ],
  });

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await Promise.all([
      order.removeGoods(order.goods, option),
      order.removeKitchenOrders(order.kitchenOrders, option),
    ]);
    await order.destroy(option);
    await t.commit();
  } catch (error) {
    t.rollback();
    throw error;
  }
};

const payOrder = async (orderId, data, option = {}) => {
  console.log('data: ', data);
  const order = await db.Order.findByPk(orderId);
  if (!order) {
    throw new ApiError(
      Errors.OrderNotFound.statusCode,
      Errors.OrderNotFound.message,
    );
  }

  const invoiceData = data.invoice;

  order.set({ payment_status: 'done' });

  const t = await db.sequelize.transaction();
  option.transaction = t;

  // todo: add discount to order

  try {
    // todo: add invoice info, currently create an empty invoice
    const invoice = await db.Invoice.create(invoiceData, option);
    await Promise.all([invoice.addOrder(order, option), order.save(option)]);
    await t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const updateOrderItem = async (orderId, itemId, data, option = {}) => {
  if (data.quantity === 0) {
    await db.OrderDetail.destroy({
      where: {
        order_id: orderId || null,
        good_id: itemId,
      },
      ...option,
    });
  } else {
    await db.OrderDetail.update(data, {
      where: {
        order_id: orderId || null,
        good_id: itemId,
      },
      ...option,
    });
  }
};

module.exports = {
  createOrder,
  getOrderDetail,
  getOrderList,
  updateOrder,
  deleteOrder,
  payOrder,
  updateOrderItem,
};
