const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodComponent extends Model {
    static associate(models) {
      models.GoodComponent.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
      models.GoodComponent.belongsTo(models.Good, {
        as: 'component',
        foreignKey: 'component_id',
      });
    }
  }

  GoodComponent.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'goods',
        },
      },
      component_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'goods',
        },
      },
      unit_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'units',
        },
      },
      quantity: {
        type: DataTypes.DOUBLE,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'GoodComponent',
      tableName: 'good_components',
    },
  );
  return GoodComponent;
};
