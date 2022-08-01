const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      models.Invoice.belongsTo(models.Order, {
        as: 'order',
        foreignKey: 'order_id',
      });
    }
  }

  Invoice.init(
    {
      ...id(DataTypes),
      order_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'orders',
        },
      },
      other_fee: {
        type: DataTypes.INTEGER,
      },
      paid_amount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Invoice',
      tableName: 'invoices',
    },
  );
  return Invoice;
};
