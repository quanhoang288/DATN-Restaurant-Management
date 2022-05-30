const { Model } = require('sequelize');
const { id, dateTime } = require('../generate');

module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    static associate(models) {
      models.Reservation.belongsTo(models.Customer, {
        as: 'customer',
        foreignKey: 'customer_id',
      });
      models.Reservation.belongsToMany(models.Table, {
        as: 'tables',
        through: {
          model: models.ReservationTable,
        },
      });
    }
  }

  Reservation.init(
    {
      ...id(DataTypes),
      customer_id: {
        type: DataTypes.BIGINT.UNSIGNED,
        references: {
          model: 'customers',
        },
      },
      dining_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      num_people: {
        type: DataTypes.INTEGER,
      },
      customer_name: {
        type: DataTypes.STRING,
      },
      customer_phone_number: {
        type: DataTypes.STRING,
      },
      note: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      ...dateTime(DataTypes),
    },
    {
      sequelize,
      modelName: 'Reservation',
      tableName: 'reservations',
    },
  );
  return Reservation;
};
