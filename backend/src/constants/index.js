const OrderType = {
  DINE_IN: 'dine in',
  TAKEAWAY: 'take away',
  DELIVERY: 'delivery',
};

const NotificationType = {
  ORDER_CREATED: {
    type: 'order_created',
    content: '',
  },
  ORDER_CANCELED: {
    type: 'order_canceled',
    content: '',
  },
  ORDER_REJECTED: {
    type: 'order_rejected',
    content: '',
  },
  ORDER_IN_PROGRESS: {
    type: 'order_in_progress',
    content: '',
  },
  ORDER_DONE: {
    type: 'order_done',
    content: '',
  },
  ORDER_IN_DELIVERY: {
    type: 'order_in_delivery',
    content: '',
  },
  ORDER_DELIVERED: {
    type: 'order_delivered',
    content: '',
  },
  ORDER_REQUESTED_TO_PAY: {
    type: 'order_requested_to_pay',
    content: '',
  },
  ORDER_ITEM_UPDATED: {
    type: 'order_item_updated',
    content: '',
  },
  ORDER_ITEM_CANCELED: {
    type: 'order_item_canceled',
    content: '',
  },
  ORDER_ITEM_REJECTED: {
    type: 'order_item_rejected',
    content: '',
  },
  ORDER_ITEM_IN_PROGRESS: {
    type: 'order_item_in_progress',
    content: '',
  },
  ORDER_ITEM_READY_TO_SERVE: {
    type: 'order_item_ready_to_serve',
    content: '',
  },
  CUSTOMER_RESERVATION_CREATED: {
    type: 'customer_reservation_created',
    content: '',
  },
  CUSTOMER_RESERVATION_CANCELED: {
    type: 'customer_reservation_canceled',
    content: '',
  },
};

module.exports = {
  OrderType,
  NotificationType,
};
