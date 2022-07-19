const { Model } = require('sequelize');
const { id } = require('../generate');

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
      models.Good.belongsToMany(models.OrderDiscount, {
        as: 'orderDiscounts',
        through: {
          model: models.OrderDiscountGood,
        },
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
      type: {
        type: DataTypes.STRING,
      },
      import_price: {
        type: DataTypes.BIGINT.UNSIGNED,
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
      manufacture_date: {
        type: DataTypes.DATE,
      },
      expires_in_days: {
        type: DataTypes.INTEGER,
      },
      expires_at: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Good',
      tableName: 'goods',
    },
  );
  return Good;
};
