const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Good extends Model {
    static associate(models) {
      models.Good.hasMany(models.GoodAttribute, {
        as: 'attributes',
        foreignKey: 'good_id',
      });
      models.Good.hasMany(models.GoodInventory, {
        as: 'goodStock',
        foreignKey: 'good_id',
      });
      models.Good.belongsToMany(models.Inventory, {
        as: 'inventories',
        through: {
          model: models.GoodInventory,
        },
        foreignKey: 'good_id',
      });
      models.Good.belongsToMany(models.Good, {
        as: 'components',
        through: {
          model: models.GoodComponent,
        },
        foreignKey: 'good_id',
      });
      models.Good.belongsToMany(models.MenuCategory, {
        as: 'menuCategories',
        through: {
          model: models.CategoryItem,
        },
        foreignKey: 'good_id',
      });
      models.Good.belongsToMany(models.Unit, {
        as: 'units',
        through: {
          model: models.GoodUnit,
        },
        foreignKey: 'good_id',
      });
      models.Good.hasMany(models.GoodUnit, {
        as: 'goodUnits',
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
      good_group_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'good_groups',
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING,
      },
      sale_price: {
        type: DataTypes.BIGINT.UNSIGNED,
      },
      delivery_sale_price: {
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
        allowNull: false,
        defaultValue: 0,
      },
      is_available: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 1,
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
