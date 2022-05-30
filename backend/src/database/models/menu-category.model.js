const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class MenuCategory extends Model {
    static associate(models) {
      models.MenuCategory.belongsTo(models.Menu, {
        as: 'menu',
        foreignKey: 'menu_id',
      });
      models.MenuCategory.belongsToMany(models.Good, {
        as: 'items',
        through: {
          model: models.CategoryItem,
        },
        foreignKey: 'category_id',
      });
    }
  }

  MenuCategory.init(
    {
      ...id(DataTypes),
      menu_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'menus',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'MenuCategory',
      tableName: 'menu_categories',
    },
  );
  return MenuCategory;
};
