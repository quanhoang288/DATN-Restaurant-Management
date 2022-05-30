const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class CategoryItem extends Model {
    static associate(models) {
      models.CategoryItem.belongsTo(models.Good, {
        as: 'item',
        foreignKey: 'good_id',
      });
      models.CategoryItem.belongsTo(models.MenuCategory, {
        as: 'category',
        foreignKey: 'category_id',
      });
    }
  }

  CategoryItem.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: { model: 'goods', key: 'good_id' },
        allowNull: false,
      },
      category_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: { model: 'menu_categories', key: 'category_id' },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CategoryItem',
      tableName: 'category_items',
    },
  );
  return CategoryItem;
};
