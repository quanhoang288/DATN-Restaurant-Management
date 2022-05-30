const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodGroup extends Model {
    static associate(models) {
      models.GoodGroup.belongsTo(models.GoodGroup, {
        as: 'parent',
        foreignKey: 'parent_id',
      });
    }
  }

  GoodGroup.init(
    {
      ...id(DataTypes),
      parent_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'good_groups',
          key: 'parent_id',
        },
      },
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
      modelName: 'GoodGroup',
      tableName: 'good_groups',
    },
  );
  return GoodGroup;
};
