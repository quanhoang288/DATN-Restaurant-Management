const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodAttribute extends Model {
    static associate(models) {
      // models.GoodAttribute.belongsTo(models.Good, {
      //   as: 'good',
      //   foreignKey: 'good_id',
      // });
      // models.GoodAttribute.hasMany(models.AttributeValue, {
      //   as: 'values',
      //   foreignKey: 'attribute_id',
      // });
    }
  }

  GoodAttribute.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      attribute_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'GoodAttribute',
      tableName: 'good_attributes',
    },
  );
  return GoodAttribute;
};
