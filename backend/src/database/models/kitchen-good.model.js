const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class KitchenGood extends Model {
    static associate(models) {
      models.KitchenGood.belongsTo(models.Kitchen, {
        as: 'kitchen',
        foreignKey: 'kitchen_id',
      });
      models.KitchenGood.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
    }
  }

  KitchenGood.init(
    {
      ...id(DataTypes),
      kitchen_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'KitchenGood',
      tableName: 'kitchen_goods',
    },
  );
  return KitchenGood;
};
