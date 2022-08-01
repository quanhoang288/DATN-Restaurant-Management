const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      models.Customer.belongsTo(models.User, {
        as: 'customer',
        foreignKey: 'id',
      });
      // models.Customer.belongsToMany(models.Group, {
      //   as: 'groups',
      //   through: {
      //     model: models.Group,
      //     unique: false,
      //   },
      //   foreignKey: 'customer_id',
      // });
    }
  }

  Customer.init(
    {
      date_of_birth: {
        type: DataTypes.DATE,
      },
      phone_number: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Customer',
      tableName: 'customers',
    },
  );
  return Customer;
};
