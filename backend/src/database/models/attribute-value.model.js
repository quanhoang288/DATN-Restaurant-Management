const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class AttributeValue extends Model {
    static associate(models) {
      models.AttributeValue.belongsTo(models.GoodAttribute, {
        as: 'values',
        foreignKey: 'attribute_id',
      });
    }
  }

  AttributeValue.init(
    {
      ...id(DataTypes),
      attribute_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'goods',
        },
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'AttributeValue',
      tableName: 'attribute_values',
    },
  );
  return AttributeValue;
};
