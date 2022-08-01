const { Model } = require('sequelize');
const { id } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class GoodVariant extends Model {
    static associate(models) {
      //   models.Invoice.belongsTo(models.Order, {
      //     as: 'order',
      //     foreignKey: 'order_id',
      //   });
    }
  }

  GoodVariant.init(
    {
      ...id(DataTypes),
      good_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'goods',
        },
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'GoodVariant',
      tableName: 'inventories',
    },
  );
  return GoodVariant;
};
