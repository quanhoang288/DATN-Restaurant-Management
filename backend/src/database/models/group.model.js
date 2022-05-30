const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      models.Group.belongsToMany(models.Customer, {
        as: 'customers',
        through: {
          model: 'customer_groups',
        },
        foreignKey: 'customer_id',
      });
    }
  }

  Group.init(
    {
      ...id(DataTypes),
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
      modelName: 'Group',
      tableName: 'customer_groups',
    },
  );
  return Group;
};
