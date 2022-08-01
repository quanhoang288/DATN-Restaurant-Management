const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    static associate(models) {
      models.Table.belongsToMany(models.Reservation, {
        as: 'reservations',
        through: {
          model: models.ReservationTable,
        },
      });
    }
  }

  Table.init(
    {
      ...id(DataTypes),
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      branch_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'branches',
        },
      },
      floor_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Table',
      tableName: 'tables',
    },
  );
  return Table;
};
