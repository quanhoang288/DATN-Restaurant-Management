const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');
const query = require('../utils/query');

const {
  getCurMonth,
  formatDate,
  timeDiffInSeconds,
  getCurWeek,
} = require('../utils/date');

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
    return order;
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getCurDateStatistics = async () => {
  const now = new Date();
  const start = now;
  const end = now;
  start.setHours(0, 0, 0);
  end.setHours(23, 59, 59);
  const orders = await db.Order.findAll({
    where: {
      created_at: {
        [Op.between]: [
          formatDate(start, 'YYYY-MM-DDThh:mm:ss'),
          formatDate(end, 'YYYY-MM-DDThh:mm:ss'),
        ],
      },
    },
    include: [
      {
        association: 'goods',
      },
      {
        association: 'invoice',
        attributes: ['paid_amount', 'created_at'],
      },
      {
        association: 'reservationTable',
        include: [
          {
            association: 'reservation',
            attributes: ['num_people'],
          },
        ],
      },
    ],
  });

  return orders.reduce(
    (stats, order) => {
      if (order.payment_status !== 'paid') {
        stats.ongoingOrders = {
          quantity: stats.ongoingOrders.quantity + 1,
          revenue:
            stats.ongoingOrders.revenue +
            order.goods.reduce(
              (total, good) =>
                total + good.sale_price * good.OrderDetail.quantity,
              0,
            ),
        };
      } else {
        stats.finsishedOrders = {
          quantity: stats.ongoingOrders.quantity + 1,
          revenue: stats.ongoingOrders.revenue + order.invoice.paid_amount,
        };
      }
      stats.customerQuantity += order.reservationTable.reservation.num_people;
      return stats;
    },
    {
      finsishedOrders: {
        quantity: 0,
        revenue: 0,
      },
      ongoingOrders: {
        quantity: 0,
        revenue: 0,
      },
      customerQuantity: 0,
    },
  );
};

const getMonthRevenueStatistics = async (type, groupBy) => {
  const now = new Date();
  const { start, end } = type === 'month' ? getCurMonth(now) : getCurWeek(now);
  const orders = await db.Order.findAll({
    include: [
      {
        association: 'invoice',
        attributes: ['paid_amount', 'created_at'],
        where: {
          created_at: {
            [Op.between]: [
              formatDate(start, 'YYYY-MM-DDThh:mm:ss'),
              formatDate(end, 'YYYY-MM-DDThh:mm:ss'),
            ],
          },
        },
        required: true,
      },
    ],
  });

  if (groupBy === 'hourly') {
    const hours = [
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
    ];
    return orders.reduce(
      (stats, order) => {
        const invoiceCreatedTime = new Date(order.invoice.created_at);

        let minDiff = 100000;
        let minIdx = -1;

        hours.forEach((hour, idx) => {
          const [h, m] = hour.split(':');
          const compareDate = invoiceCreatedTime;
          compareDate.setHours(h, m);
          console.log('compare date: ', compareDate);

          const timeDiff = timeDiffInSeconds(invoiceCreatedTime, compareDate);

          if (timeDiff < minDiff) {
            minDiff = timeDiff;
            minIdx = idx;
          }
        });

        if (order.type === 'dine-in') {
          stats.dinein[minIdx] += order.invoice.paid_amount;
        } else if (order.type === 'takeaway') {
          stats.takeaway[minIdx] += order.invoice.paid_amount;
        } else {
          stats.delivery[minIdx] += order.invoice.paid_amount;
        }

        return stats;
      },
      {
        dinein: Array(hours.length).fill(0),
        takeaway: Array(hours.length).fill(0),
        delivery: Array(hours.length).fill(0),
      },
    );
  }
  if (groupBy === 'dayInWeek') {
    return orders.reduce(
      (stats, order) => {
        const invoiceCreatedTime = new Date(order.invoice.created_at);
        const dayInWeek = invoiceCreatedTime.getDay();

        if (order.type === 'dine-in') {
          stats.dinein[dayInWeek] += order.invoice.paid_amount;
        } else if (order.type === 'takeaway') {
          stats.takeaway[dayInWeek] += order.invoice.paid_amount;
        } else {
          stats.delivery[dayInWeek] += order.invoice.paid_amount;
        }

        return stats;
      },
      {
        dinein: Array(7).fill(0),
        takeaway: Array(7).fill(0),
        delivery: Array(7).fill(0),
      },
    );
  }
  // if (groupBy === 'dayInMonth') {
  // }
};

const getMonthCustomerQuantity = async (type, groupBy) => {
  const now = new Date();
  const { start, end } = type === 'month' ? getCurMonth(now) : getCurWeek(now);

  const orders = await db.Order.findAll({
    where: {
      created_at: {
        [Op.between]: [
          formatDate(start, 'YYYY-MM-DDThh:mm:ss'),
          formatDate(end, 'YYYY-MM-DDThh:mm:ss'),
        ],
      },
      type: 'dine-in',
    },
    attributes: ['created_at'],
    include: [
      {
        association: 'reservationTable',
        include: [
          {
            association: 'reservation',
            attributes: ['num_people'],
          },
        ],
      },
    ],
  });

  if (groupBy === 'hourly') {
    const hours = [
      '08:00',
      '10:00',
      '12:00',
      '14:00',
      '16:00',
      '18:00',
      '20:00',
    ];
    return orders.reduce((stats, order) => {
      const createdTime = new Date(order.created_at);

      let minDiff = 100000;
      let minIdx = -1;

      hours.forEach((hour, idx) => {
        const [h, m] = hour.split(':');
        const compareDate = createdTime;
        compareDate.setHours(h, m);
        console.log('compare date: ', compareDate);

        const timeDiff = timeDiffInSeconds(createdTime, compareDate);

        if (timeDiff < minDiff) {
          minDiff = timeDiff;
          minIdx = idx;
        }
      });

      stats[minIdx] += order.reservationTable.reservation.num_people;

      return stats;
    }, Array(hours.length).fill(0));
  }
  if (groupBy === 'dayInWeek') {
    return orders.reduce((stats, order) => {
      const invoiceCreatedTime = new Date(order.invoice.created_at);
      const dayInWeek = invoiceCreatedTime.getDay();

      stats[dayInWeek] += order.reservationTable.reservation.num_people;

      return stats;
    }, Array(7).fill(0));
  }
};

const getOrderList = async (params = {}) => {
  // todo: filters and pagination

  const filters = params.filters || {};
  const sort = params.sort || [];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Order.paginate({
      page: params.page || 1,
      perPage: params.perPage || 5,
      where: query.filter(Op, filters),
      include: [
        {
          association: 'reservationTable',
          include: [
            {
              association: 'table',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      order: sort,
    });

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
    include: [
      {
        association: 'reservationTable',
        include: [
          {
            association: 'table',
            attributes: ['id', 'name'],
          },
        ],
      },
    ],
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Order.findAll(option);
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
  getMonthRevenueStatistics,
  getCurDateStatistics,
  getMonthCustomerQuantity,
};
