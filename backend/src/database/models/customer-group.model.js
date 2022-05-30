const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class CustomerGroup extends Model {
    static associate(models) {
      models.CustomerGroup.hasMany(models.Customer, {
        as: 'customers',
        foreignKey: 'customer_id',
      });
    }
  }

  CustomerGroup.init(
    {
      ...id(DataTypes),
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'CustomerGroup',
      tableName: 'customer_groups',
    },
  );
  return CustomerGroup;
};
