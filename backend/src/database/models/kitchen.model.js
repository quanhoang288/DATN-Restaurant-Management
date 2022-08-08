const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Kitchen extends Model {
    static associate(models) {
      models.Kitchen.belongsTo(models.Branch, {
        as: 'branch',
        foreignKey: 'branch_id',
      });
    }
  }

  Kitchen.init(
    {
      ...id(DataTypes),
      branch_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'branches',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      floor_num: {
        type: DataTypes.INTEGER,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Kitchen',
      tableName: 'kitchens',
    },
  );
  return Kitchen;
};
