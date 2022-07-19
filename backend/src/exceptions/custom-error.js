const httpStatus = require('http-status');

const Errors = {
  DuplicateKitchenName: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate kitchen name',
  },
  KitchenNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Kitchen not found',
  },
  DuplicateGoodName: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate good name',
  },
  GoodNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Good not found',
  },
  DuplicateGoodGroupName: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate good group name',
  },
  GoodGroupNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Good group not found',
  },
  DuplicateTableName: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Duplicate table name',
  },
  TableNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Table not found',
  },
  TableOccupied: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Table is already occupied',
  },
  ReservationNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Reservation not found',
  },
  OrderNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Order not found',
  },
  UserNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'User not found',
  },
  DiscountNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Discount not found',
  },
  MenuNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Menu not found',
  },
  MenuCategoryNotFound: {
    statusCode: httpStatus.NOT_FOUND,
    message: 'Menu category not found',
  },
  TableNotReserved: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Table is not reserved and checked in yet',
  },
  OrderAlreadyCreated: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'There has been an order created already',
  },
  InvalidNotificationType: {
    statusCode: httpStatus.BAD_REQUEST,
    message: 'Notification type does not exist',
  },
};

module.exports = Errors;
