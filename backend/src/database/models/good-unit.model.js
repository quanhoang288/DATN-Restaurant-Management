const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodUnit extends Model {
    static associate(models) {
      models.GoodUnit.belongsTo(models.Good, {
        as: 'good',
        foreignKey: 'good_id',
      });
      models.GoodUnit.belongsTo(models.Good, {
        as: 'component',
        foreignKey: 'component_id',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      multiplier: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 1.0,
      },
    },
    {
      sequelize,
      modelName: 'GoodUnit',
      tableName: 'good_units',
    },
  );
  return GoodUnit;
};
