const httpStatus = require('http-status');
const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const createOrder = async (data, option = {}) => {
  // in-house order
  // takeaway order
  // delivery order -> delivery info
  // dishes
  if (data.details) {
  }

  if (data.delivery_info)
    await db.Order.create(data, {
      ...option,
      include: [
        {
          association: 'details',
          ...option,
        },
      ],
    });

  // TODO: create invoice for order

  // TODO: add delivery info in case of delivery order
};

const getOrderList = async () => {};

const getOrderDetail = async (orderId) => {
  const order = db.Order.findOne({
    where: {
      id: orderId,
    },
    include: [
      {
        association: 'details',
      },
      {
        association: 'goods',
      },
      {
        association: 'deliveryInfo',
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
  // them mon, huy mon
  // thay doi dia chi giao hang
  const order = await getOrderDetail(orderId);
  const detailUpdateData = data.details || [];
  const oldDetailData = order.details || [];
  delete data.details;

  const itemsToUpdate = [];
  const itemsToRemove = [];
  const newItems = detailUpdateData.filter(
    (item) =>
      oldDetailData.findIndex((oldData) => oldData.good_id === item.good_id) ===
      -1,
  );
  const updatePromises = [];

  const deliveryInfoUpdate = data.delivery_info || {};
  delete data.delivery_info;

  order.deliveryInfo.set(deliveryInfoUpdate);
  updatePromises.push(order.deliveryInfo.save(option));

  // TODO: update order details

  updatePromises.push(order.save(option));
  return Promise.all(updatePromises);
};

const deleteOrder = async (orderId, option = {}) => {
  const order = await db.Order.findOne({
    where: {
      id: orderId,
    },
    include: [
      {
        association: 'details',
      },
      {
        association: 'orderDiscounts',
      },
    ],
  });
  if (!order) {
    throw new ApiError(
      Errors.OrderNotFound.statusCode,
      Errors.OrderNotFound.message,
    );
  }

  const deletePromises = [
    db.OrderDetail.destroy(
      {
        where: (order.details || []).map((detail) => detail.id),
      },
      option,
    ),
    db.OrderDiscount.destroy(
      {
        where: (order.orderDiscounts || []).map(
          (orderDiscount) => orderDiscount.id,
        ),
      },
      option,
    ),
  ];
  await Promise.all(deletePromises);
  return order.destroy(option);
};

module.exports = {
  createOrder,
  getOrderDetail,
  getOrderList,
  updateOrder,
  deleteOrder,
};
