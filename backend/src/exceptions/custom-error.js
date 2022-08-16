const httpStatus = require('http-status');

const Errors = {
  DuplicateKitchenName: {
    code: 'KITCHEN_00000',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate kitchen name',
  },
  KitchenNotFound: {
    code: 'KITCHEN_00001',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Kitchen not found',
  },
  DuplicateGoodName: {
    code: 'GOOD_00000',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate good name',
  },
  GoodNotFound: {
    code: 'GOOD_00001',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Good not found',
  },
  DuplicateGoodGroupName: {
    code: 'GOOD_GROUP_00000',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate good group name',
  },
  GoodGroupNotFound: {
    code: 'GOOD_GROUP_00001',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Good group not found',
  },
  DuplicateTableName: {
    code: 'TABLE_00000',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate table name',
  },
  TableNotFound: {
    code: 'TABLE_00001',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Table not found',
  },
  TableOccupied: {
    code: 'TABLE_00002',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Table is already occupied',
  },
  TableNotReserved: {
    code: 'TABLE_00003',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Table is not reserved and checked in yet',
  },
  ReservationNotFound: {
    code: 'RESERVATION_00000',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Reservation not found',
  },
  OrderNotFound: {
    code: 'ORDER_00000',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Order not found',
  },
  OrderAlreadyCreated: {
    statusCode: httpStatus.BAD_REQUEST,
    code: 'ORDER_00001',
    message: 'There has been an order created already',
  },
  UserNotFound: {
    code: 'USER_00000',
    statusCode: httpStatus.NOT_FOUND,
    message: 'User not found',
  },
  DiscountNotFound: {
    code: 'DISCOUNT_00000',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Discount not found',
  },
  MenuNotFound: {
    code: 'MENU_00000',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Menu not found',
  },
  MenuCategoryNotFound: {
    code: 'MENU_00001',
    statusCode: httpStatus.NOT_FOUND,
    message: 'Menu category not found',
  },

  InvalidNotificationType: {
    code: 'NOTIFICATION_00001',
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Notification type does not exist',
  },
};

module.exports = Errors;
