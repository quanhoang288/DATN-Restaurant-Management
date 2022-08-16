const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodUnit extends Model {
    static associate(models) {
      models.GoodUnit.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
      models.GoodUnit.belongsTo(models.Unit, {
        as: 'unit',
        foreignKey: 'unit_id',
      });
    }
  }

  GoodUnit.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'goods',
        },
      },
      unit_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      unit_cost: {
        type: DataTypes.INTEGER,
      },
      multiplier: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 1.0,
      },
    },
    {
      sequelize,
      modelName: 'GoodUnit',
      tableName: 'good_unit',
    },
  );
  return GoodUnit;
};
