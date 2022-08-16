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
      image: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
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
