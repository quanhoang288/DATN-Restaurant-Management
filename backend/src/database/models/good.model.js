const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Good extends Model {
    static associate(models) {
      models.Good.hasMany(models.GoodAttribute, {
        as: 'attributes',
        foreignKey: 'good_id',
      });
      models.Good.belongsToMany(models.Good, {
        as: 'components',
        through: {
          model: models.GoodComponent,
        },
        foreignKey: 'component_id',
      });
      models.Good.belongsToMany(models.MenuCategory, {
        as: 'menuCategories',
        through: {
          model: models.CategoryItem,
        },
        foreignKey: 'good_id',
      });
      models.Good.hasMany(models.GoodUnit, {
        as: 'units',
        foreignKey: 'good_id',
      });
    }
  }

  Good.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
      import_price: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      sale_price: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      min_quantity_threshold: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      max_quantity_threshold: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      is_sold_directly: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      is_topping: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      usage_period_in_days: {
        type: DataTypes.INTEGER,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Good',
      tableName: 'goods',
    },
  );
  return Good;
};
