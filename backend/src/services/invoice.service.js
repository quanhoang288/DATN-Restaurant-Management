const db = require('../database/models');

const { Op } = db.Sequelize;

const createInvoice = async (data, option = {}) => {
  console.log('invoice data: ', data);
  const mergedOrders = data.mergedOrders || [];
  delete data.mergedOrders;

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const updatePromises = [db.Invoice.create(data, option)];

  if (mergedOrders.length) {
    updatePromises.push(
      db.Order.update(
        {
          payment_status: 'paid',
          status: 'done',
          parent_id: data.order_id,
        },
        {
          where: {
            id: {
              [Op.in]: mergedOrders,
            },
          },
          ...option,
        },
      ),
    );
  }

  try {
    await Promise.all(updatePromises);

    t.commit();
  } catch (error) {
    t.rollback();
    throw error;
  }
};

const getInvoice = async (invoiceId) => {
  const invoice = await db.Invoice.findByPk(invoiceId);
  return invoice;
};

module.exports = {
  createInvoice,
  getInvoice,
};
