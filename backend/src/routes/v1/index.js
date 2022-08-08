const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const goodGroupRoute = require('./good-group.route');
const tableRoute = require('./table.route');
const kitchenRoute = require('./kitchen.route');
const reservationRoute = require('./reservation.route');
const orderRoute = require('./order.route');
const staffRoute = require('./staff.route');
const discountRoute = require('./discount.route');
const goodRoute = require('./good.route');
const menuRoute = require('./menu.route');
const invoiceRoute = require('./invoice.route');
const roleRoute = require('./role.route');
const branchRoute = require('./branch.route');
const inventoryRoute = require('./inventory.route');
const inventoryHistoryRoute = require('./inventory-history.route');
const unitRoute = require('./unit.route');

const router = express.Router();

const routes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/good-groups',
    route: goodGroupRoute,
  },
  {
    path: '/tables',
    route: tableRoute,
  },
  {
    path: '/kitchens',
    route: kitchenRoute,
  },
  {
    path: '/reservations',
    route: reservationRoute,
  },
  {
    path: '/orders',
    route: orderRoute,
  },
  {
    path: '/staff',
    route: staffRoute,
  },
  {
    path: '/discounts',
    route: discountRoute,
  },
  {
    path: '/goods',
    route: goodRoute,
  },
  {
    path: '/menus',
    route: menuRoute,
  },
  {
    path: '/invoices',
    route: invoiceRoute,
  },
  {
    path: '/roles',
    route: roleRoute,
  },
  {
    path: '/branches',
    route: branchRoute,
  },
  {
    path: '/inventories',
    route: inventoryRoute,
  },
  {
    path: '/inventory-histories',
    route: inventoryHistoryRoute,
  },
  {
    path: '/units',
    route: unitRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
