const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');
const query = require('../utils/query');

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
        Errors.TableNotReserved.code,
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
        Errors.OrderAlreadyCreated.code,
      );
    }
    data.reservation_table_id = reservationTable.id;
    delete data.table;
  }

  const discountData = data.discounts || [];
  delete data.discounts;

  data.details = data.details.map((item) => ({
    good_id: item.id,
    quantity: item.quantity,
    status: item.status || 'pending',
  }));

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

const getOrderList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [['created_at', 'DESC']];
  const tableFilters = params.filters.table || {};
  delete filters.table;

  console.log(filters);

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
              where: query.filter(Op, tableFilters),
            },
          ],
        },
        {
          association: 'customer',
          include: [
            {
              association: 'user',
              attributes: ['full_name', 'phone_number'],
            },
          ],
        },
        {
          association: 'deliveryInfo',
          attributes: ['delivery_address'],
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
            where: query.filter(Op, tableFilters),
          },
        ],
      },
      {
        association: 'goods',
        through: {
          attributes: ['quantity'],
        },
        attributes: ['id', 'name', 'sale_price'],
      },
    ],
  };

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
            attributes: ['id', 'name', 'branch_id'],
          },
        ],
      },
      {
        association: 'invoice',
      },
      {
        association: 'customer',
        include: [
          {
            association: 'user',
            attributes: ['full_name', 'phone_number'],
          },
        ],
      },
      {
        association: 'deliveryInfo',
        attributes: ['delivery_address'],
      },
      {
        association: 'branch',
        attributes: ['id', 'name', 'address'],
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
  const order = await getOrderDetail(orderId);

  if (data.table && data.table !== order.reservationTable?.table?.id) {
    const existingReservationTable = await db.ReservationTable.findOne({
      where: {
        table_id: data.table,
      },
      include: [
        {
          association: 'reservation',
          attributes: [],
          where: {
            status: {
              [Op.in]: ['confirmed', 'serving'],
            },
          },
          required: true,
        },
      ],
    });

    if (existingReservationTable) {
      throw new ApiError(
        Errors.TableOccupied.statusCode,
        Errors.TableOccupied.message,
        Errors.TableOccupied.code,
      );
    }
  }

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const detailData = data.details || [];
  const orderItems = order.goods || [];
  delete data.details;

  const newGoods = detailData.filter(
    (good) => !orderItems.some((item) => item.id === good.id),
  );
  const goodsToUpdate = detailData.filter((good) =>
    orderItems.some((item) => item.id === good.id),
  );
  const goodsToRemove = orderItems.filter(
    (item) => !detailData.some((good) => good.id === item.id),
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

  const discountsToRemove = order.orderDiscounts.filter(
    (orderDiscount) =>
      !discountData.some(
        (discount) =>
          discount.constraint.id === orderDiscount.discount_constraint_id,
      ),
  );

  order.set(data);

  if (data.delivery_status === 'delivered') {
    order.set({ status: 'done', payment_status: 'paid' });
  }

  if (discountsToRemove.length) {
    const orderDiscountIds = discountsToRemove.map(
      (orderDiscount) => orderDiscount.id,
    );
    await order.removeOrderDiscounts(orderDiscountIds);
  }

  const updatePromises = [
    newDiscounts.map(
      (discount) =>
        new Promise(() => {
          const discountGoods = (discount.discountItems || []).map((item) => ({
            good_id: item.id,
          }));

          // eslint-disable-next-line no-promise-executor-return
          return db.OrderDiscount.create(
            {
              order_id: order.id,
              discount_constraint_id: discount.constraint.id,
              discountGoods,
            },
            {
              ...option,
              include: [{ association: 'discountGoods' }],
            },
          );
        }),
    ),

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
  ];

  if (data.prepare_status === 'ready_to_serve') {
    // update stock amount
    const itemsToUpdate = (order.goods || []).filter(
      (item) => item.OrderDetail?.status !== 'ready_to_serve',
    );
    updatePromises.push(
      db.OrderDetail.update(
        { status: order.type === 'delivery' ? 'done' : 'ready_to_serve' },
        {
          where: {
            good_id: {
              [Op.in]: itemsToUpdate.map((item) => item.id),
            },
            order_id: order.id,
          },
          ...option,
        },
      ),
    );
  }

  if (
    order.type === 'dine-in' &&
    data.status === 'done' &&
    order.reservationTable?.reservation
  ) {
    order.reservationTable.reservation.set({ status: 'done' });
    updatePromises.push(order.reservationTable.reservation.save(option));
  }

  if (goodsToRemove.length) {
    updatePromises.push(order.removeGoods, option);
  }

  try {
    await Promise.all(updatePromises);
    if (data.delivery_status === 'delivered') {
      console.log('creating invoice', {
        order_id: order.id,
        other_fee: 0,
        discount: 0,
        paid_amount: (order.goods || []).reduce(
          (total, item) =>
            (total += item.OrderDetail.quantity * item.sale_price),
          0,
        ),
      });
      await db.Invoice.create(
        {
          order_id: order.id,
          other_fee: 0,
          discount: 0,
          paid_amount: (order.goods || []).reduce(
            (total, item) =>
              (total += item.OrderDetail.quantity * item.sale_price),
            0,
          ),
        },
        option,
      );
    }

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
    ],
  });

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await order.removeGoods(order.goods, option);
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

const updateOrderItem = async (itemId, data, option = {}) => {
  console.log('order item data: ', data);
  const t = await db.sequelize.transaction();
  option.transaction = t;

  const orderId = data.order_id || null;
  delete data.order_id;

  try {
    if (data.quantity === 0) {
      console.log('removing order item');
      await db.OrderDetail.destroy({
        where: {
          order_id: orderId || null,
          good_id: itemId,
        },
        ...option,
      });
    } else if (data.status === 'rejected' && !orderId) {
      console.log('rejecting all orders');
      const orderDetails = await db.OrderDetail.findAll({
        where: {
          good_id: itemId,
        },
        include: [
          {
            association: 'order',
            include: [
              {
                association: 'details',
                where: {
                  good_id: itemId,
                  status: 'pending',
                },
                required: true,
              },
            ],
            required: true,
          },
        ],
      });
      console.log('order details: ', orderDetails);
      await db.OrderDetail.update(data, {
        where: {
          id: {
            [Op.in]: orderDetails.map((detail) => detail.id),
          },
        },
        ...option,
      });

      await db.Good.update(
        { is_available: 0 },
        {
          where: {
            id: itemId,
          },
        },
      );
    } else {
      await db.OrderDetail.update(data, {
        where: {
          order_id: orderId || null,
          good_id: itemId,
        },
        ...option,
      });
      const processingItems = await db.OrderDetail.findAll({
        where: {
          order_id: orderId,
          status: {
            [Op.in]: ['pending', 'in_progress'],
          },
        },
      });
      if (data.status === 'ready_to_serve' && !processingItems.length) {
        await db.Order.update(
          { prepare_status: 'ready_to_serve' },
          {
            where: {
              id: orderId,
            },
            ...option,
          },
        );
      }
    }
    t.commit();
  } catch (error) {
    t.rollback();
    throw error;
  }
};

const getKitchenOrderItems = async (branchId = null, status = 'pending') => {
  console.log('status: ', status);
  const items = await db.OrderDetail.findAll({
    where: {
      status,
    },
    include: [
      {
        association: 'order',
        where: {
          status: { [Op.notIn]: ['pending', 'rejected', 'canceled'] },
          prepare_status: {
            [Op.in]: ['pending', 'in_progress'],
          },
        },
        required: true,
      },
      {
        association: 'good',
      },
    ],
  });
  return items.reduce((res, curItem) => {
    const itemIdx = res.findIndex((item) => item.id === curItem.good_id);
    if (itemIdx === -1) {
      return [
        ...res,
        {
          id: curItem.good_id,
          name: curItem.good?.name,
          quantity: curItem.quantity,
        },
      ];
    }
    res[itemIdx] = {
      ...res[itemIdx],
      quantity: res[itemIdx].quantity + curItem.quantity,
    };
    return res;
  }, []);
};

const bulkUpdateItems = async (itemId, status, option = {}) => {
  const prevStatus = ['in_progress', 'rejected'].includes(status)
    ? 'pending'
    : 'in_progress';
  const items = await db.OrderDetail.findAll({
    where: {
      status: prevStatus,
      good_id: itemId,
    },
    include: [
      {
        association: 'order',
        where: {
          status: {
            [Op.notIn]: ['pending', 'rejected', 'canceled'],
          },
          prepare_status: {
            [Op.in]: ['pending', 'in_progress'],
          },
        },
        required: true,
      },
    ],
  });

  const updatePromises = [
    db.OrderDetail.update(
      { status },
      {
        where: {
          id: {
            [Op.in]: items.map((item) => item.id),
          },
        },
        ...option,
      },
    ),
  ];

  if (status === 'in_progress') {
    const orderIdsToUpdate = items.reduce((orders, item) => {
      if (
        item.order.prepare_status === 'pending' &&
        !orders.find((id) => id === item.order.id)
      ) {
        return [...orders, item.order.id];
      }
      return orders;
    }, []);
    updatePromises.push(
      db.Order.update(
        { prepare_status: 'in_progress' },
        {
          where: {
            id: {
              [Op.in]: orderIdsToUpdate,
            },
          },
          ...option,
        },
      ),
    );
  }

  if (status === 'rejected') {
    updatePromises.push(
      db.Good.update(
        { is_available: 0 },
        {
          where: {
            id: itemId,
          },
          ...option,
        },
      ),
    );
  }

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await Promise.all(updatePromises);
    t.commit();
  } catch (error) {
    t.rollback();
    throw error;
  }
};

module.exports = {
  createOrder,
  getOrderDetail,
  getOrderList,
  updateOrder,
  deleteOrder,
  payOrder,
  getKitchenOrderItems,
  bulkUpdateItems,
  updateOrderItem,
};
