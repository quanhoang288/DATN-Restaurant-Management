const authService = require('./auth.service');
const emailService = require('./email.service');
const tokenService = require('./token.service');
const userService = require('./user.service');
const goodGroupService = require('./good-group.service');
const goodService = require('./good.service');
const kitchenService = require('./kitchen.service');
const tableService = require('./table.service');
const reservationService = require('./reservation.service');
const orderService = require('./order.service');
const staffService = require('./staff.service');
const discountService = require('./discount.service');
const menuService = require('./menu.service');

module.exports = {
  authService,
  emailService,
  tokenService,
  userService,
  goodGroupService,
  goodService,
  kitchenService,
  tableService,
  reservationService,
  orderService,
  staffService,
  discountService,
  menuService,
};
