const OrderType = {
  DINE_IN: 'dine-in',
  TAKEAWAY: 'take-away',
  DELIVERY: 'delivery',
};

const NotificationType = {
  ORDER_CREATED: {
    // doi tuong nhan thong bao: bep, nhan vien thu ngan, admin
    type: 'order_created',
    content: '',
  },
  ORDER_CANCELED: {
    // doi tuong: bep, nhan vien thu ngan
    type: 'order_canceled',
    content: '',
  },
  ORDER_REJECTED: {
    // doi tuong: nhan vien thu ngan, phuc vu, khach hang
    type: 'order_rejected',
    content: '',
  },
  ORDER_IN_PROGRESS: {
    // doi tuong thong bao: nhan vien thu ngan, phuc vu khach hang
    type: 'order_in_progress',
    content: '',
  },
  ORDER_DONE: {
    // doi tuong: thu ngan, phuc vu
    type: 'order_done',
    content: '',
  },
  ORDER_IN_DELIVERY: {
    // doi tuong: khach hang
    type: 'order_in_delivery',
    content: '',
  },
  ORDER_DELIVERED: {
    // doi tuong: khach hang
    type: 'order_delivered',
    content: '',
  },
  ORDER_REQUESTED_TO_PAY: {
    // doi tuong: thu ngan
    type: 'order_requested_to_pay',
    content: '',
  },
  ORDER_ITEM_UPDATED: {
    // doi tuong: bep
    type: 'order_item_updated',
    content: '',
  },
  ORDER_ITEM_CANCELED: {
    // doi tuong: bep
    type: 'order_item_canceled',
    content: '',
  },
  ORDER_ITEM_REJECTED: {
    // doi tuong: thu ngan, phuc vu
    type: 'order_item_rejected',
    content: '',
  },
  // ORDER_ITEM_IN_PROGRESS: {
  //   type: 'order_item_in_progress',
  //   content: '',
  // },
  ORDER_ITEM_READY_TO_SERVE: {
    // doi tuong: phuc vu
    type: 'order_item_ready_to_serve',
    content: '',
  },
  CUSTOMER_RESERVATION_CREATED: {
    // doi tuong: thu ngan, admin
    type: 'customer_reservation_created',
    content: '',
  },
  CUSTOMER_RESERVATION_CANCELED: {
    // doi tuong: thu ngan, admin
    type: 'customer_reservation_canceled',
    content: '',
  },
};

module.exports = {
  OrderType,
  NotificationType,
};
