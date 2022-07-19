const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    static associate(models) {
      models.Menu.hasMany(models.MenuCategory, {
        as: 'categories',
        foreignKey: 'menu_id',
      });
    }
  }

  Menu.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Menu',
      tableName: 'menus',
    },
  );
  return Menu;
};
