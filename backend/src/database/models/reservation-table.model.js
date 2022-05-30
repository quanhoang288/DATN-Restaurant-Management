const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class ReservationTable extends Model {
    static associate(models) {
      models.ReservationTable.belongsTo(models.Reservation, {
        as: 'reservation',
        foreignKey: 'reservation_id',
      });
      models.ReservationTable.belongsTo(models.Table, {
        as: 'table',
        foreignKey: 'table_id',
      });
    }
  }

  ReservationTable.init(
    {
      ...id(DataTypes),
      reservation_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'reservations',
        },
      },
      table_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'table',
        },
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'ReservationTable',
      tableName: 'reservation_tables',
    },
  );
  return ReservationTable;
};
