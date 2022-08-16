const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class DeliveryInfo extends Model {
    static associate(models) {
      models.DeliveryInfo.belongsTo(models.Customer, {
        as: 'customer',
        foreignKey: 'customer_id',
      });
    }
  }

  DeliveryInfo.init(
    {
      ...id(DataTypes),
      customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'customer_id',
        },
      },
      name: {
        type: DataTypes.STRING,
      },
      delivery_address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_default: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'DeliveryInfo',
      tableName: 'delivery_infos',
    },
  );
  return DeliveryInfo;
};
