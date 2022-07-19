const db = require('../database/models');
const query = require('../utils/query');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');
const messagingService = require('./messaging.service');

const { Op } = db.Sequelize;

const createReservation = async (data, option = {}) => {
  // check if table is already occupied
  const existingReservationTable = await db.ReservationTable.findOne({
    where: {
      table_id: {
        [Op.in]: data.tables || [],
      },
    },
    include: [
      {
        association: 'reservation',
        attributes: ['id', 'status'],
        where: {
          status: {
            [Op.in]: ['confirmed', 'serving'],
          },
        },
        required: true,
      },
    ],
  });
  if (existingReservationTable) {
    throw new ApiError(
      Errors.TableOccupied.statusCode,
      Errors.TableOccupied.message,
    );
  }

  data.reservationTables = (data.tables || []).map((tableId) => ({
    table_id: tableId,
  }));
  delete data.tables;

  // TODO: check if user already booked at the same time
  // with user in system: check if there's any reservation with overlapping schedule
  // with guest user: check by phone number ??

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    const reservation = await db.Reservation.create(data, {
      ...option,
      include: [
        {
          association: 'reservationTables',
        },
      ],
    });
    await t.commit();
    return reservation;
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getReservationList = async (params = {}) => {
  const filter = params.filter || {};
  const sort = params.sort || [];

  if (params.page) {
    const items = await db.Reservation.paginate({
      page: params.page,
      paginate: params.limit || 10,
      where: query.filter(Op, filter),
      order: sort,
    });

    return query.getPagingData(items, params.page, params.limit);
  }

  const option = {
    where: filter,
    sort,
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Reservation.findAll(option);
};

const getReservationDetail = async (reservationId) => {
  const reservation = await db.Reservation.findByPk(reservationId, {
    include: [
      {
        association: 'tables',
        attributes: ['id', 'name'],
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (!reservation) {
    throw new ApiError(
      Errors.ReservationNotFound.statusCode,
      Errors.ReservationNotFound.message,
    );
  }
  return reservation;
};

const updateReservation = async (reservationId, data, option = {}) => {
  const reservation = await getReservationDetail(reservationId);
  const tableUpdateData = data.tables || [];
  const bookedTables = reservation.tables || [];

  const newTableIds = tableUpdateData.filter(
    (tableId) =>
      !bookedTables.some((bookedTable) => bookedTable.id === tableId),
  );
  const canceledTableIds = bookedTables
    .filter((table) => !tableUpdateData.includes(table.id))
    .map((table) => table.id);

  const occupiedReservationTables = await db.ReservationTable.findOne({
    where: {
      table_id: {
        [Op.in]: newTableIds,
      },
      reservation_id: {
        [Op.ne]: reservation.id,
      },
    },
    include: [
      {
        association: 'reservation',
        where: {
          status: {
            [Op.in]: ['confirmed', 'serving'],
          },
        },
        required: true,
      },
    ],
  });
  if (occupiedReservationTables) {
    const occupiedTables = occupiedReservationTables.map(
      (reservationTable) => reservationTable.table.name,
    );
    const errMsg = `Tables already occupied:  ${occupiedTables.join(', ')}`;
    throw new ApiError(Errors.TableOccupied.statusCode, errMsg);
  }

  delete data.tables;
  reservation.set(data);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await Promise.all([
      db.ReservationTable.bulkCreate(
        newTableIds.map((id) => ({
          reservation_id: reservation.id,
          table_id: id,
        })),
        option,
      ),
      db.ReservationTable.destroy({
        where: {
          reservation_id: reservation.id,
          table_id: {
            [Op.in]: canceledTableIds,
          },
        },
        ...option,
      }),
      reservation.save(option),
    ]);
    await t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const deleteReservation = async (reservationId, option = {}) => {
  const reservation = await getReservationDetail(reservationId);

  const t = await db.sequelize.transaction();
  option.transaction = t;
  try {
    await reservation.removeTables(reservation.tables, option);
    await reservation.destroy(option);
    await t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const sendReminders = async () => {
  const now = new Date();
  // TODO: get reservations due to remind
  const reservationsToRemind = await db.Reservation.find({});
  console.log('checking');
  // await Promise.all(
  //   reservationsToRemind.map((reservation) =>
  //     messagingService.sendMessage(
  //       reservation.customer_phone_number,
  //       `Hi ${reservation.customer_name}. This is a reminder message to inform you that you have an reservation coming up at ${reservation.arrive_time}`,
  //     ),
  //   ),
  // );
};

module.exports = {
  createReservation,
  getReservationDetail,
  getReservationList,
  updateReservation,
  deleteReservation,
  sendReminders,
};
