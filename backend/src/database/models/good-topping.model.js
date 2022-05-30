const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodTopping extends Model {
    static associate(models) {
      models.GoodTopping.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
      models.GoodTopping.belongsTo(models.Good, {
        as: 'topping',
        foreignKey: 'topping_id',
      });
    }
  }

  GoodTopping.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'goods',
        },
      },
      topping_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'goods',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'GoodTopping',
      tableName: 'good_toppings',
    },
  );
  return GoodTopping;
};
