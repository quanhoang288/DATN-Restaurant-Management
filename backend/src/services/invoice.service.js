const db = require('../database/models');

const createInvoice = async (data, option = {}) =>
  db.Invoice.create(data, option);

module.exports = {
  createInvoice,
};
