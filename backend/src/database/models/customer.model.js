const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      models.Customer.belongsTo(models.User, { as: 'user', foreignKey: 'id' });
    }
  }

  Customer.init(
    {
      ...id(DataTypes, {
        references: {
          model: 'users',
        },
      }),
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'customers',
    },
  );
  return Customer;
};
