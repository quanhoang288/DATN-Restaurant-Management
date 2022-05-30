const db = require('../database/models');
const query = require('../utils/query');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db;

const createReservation = async (data, option = {}) => {
  // check if table is already occupied
  const existingReservationTable = await db.ReservationTable.findOne({
    where: {
      table_id: {
        [Op.in]: data.tables,
      },
    },
    include: [
      {
        association: 'reservation',
        include: ['id', 'status'],
        where: {
          status: 'IN_PROGRESS',
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

  // TODO: check if user already booked at the same time
  // with user in system: check if there's any reservation with overlapping schedule
  // with guest user: check by phone number ??

  const bookedTables = data.tables || [];
  delete data.tables;

  const reservation = await db.Reservation.create(data, option);
  const reservationTableData = bookedTables.map((tableId) => ({
    reservation_id: reservation.id,
    table_id: tableId,
  }));
  return db.ReservationTable.bulkCreate(reservationTableData, option);
};

const getReservationList = async (params) => {
  const items = await db.Reservation.paginate({
    page: params.page,
    paginate: params.limit,
    where: query.filter(Op, params.filter || {}),
    sort: params.sort || {},
  });
  return query.getPagingData(items, params.page, params.limit);
};

const getReservationDetail = async (reservationId) => {
  const reservation = await db.Reservation.findOne({
    where: {
      id: reservationId,
    },
    include: [
      {
        association: 'tables',
        attributes: ['id', 'name'],
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
    (table) =>
      bookedTables.findIndex((bookedTable) => bookedTable.id === table) === -1,
  );
  const canceledTableIds = bookedTables
    .filter((table) => !tableUpdateData.includes(table.id))
    .map((table) => table.id);
  const occupiedReservationTables = await db.ReservationTable.find({
    where: {
      table_id: {
        [Op.in]: newTableIds,
      },
      attributes: ['id', 'name'],
      include: [
        {
          association: 'reservation',
          include: [],
          where: {
            status: 'IN_PROGRESS',
          },
          required: true,
        },
        {
          association: 'table',
          attribute: ['id', 'name'],
        },
      ],
    },
  });
  if (occupiedReservationTables) {
    const occupiedTables = occupiedReservationTables.map(
      (reservationTable) => reservationTable.table.name,
    );
    const errMsg = `Tables already occupied:  ${occupiedTables.join(', ')}`;
    throw new ApiError(Errors.TableOccupied.statusCode, errMsg);
  }
  const updatePromises = [
    db.ReservationTable.bulkCreate(
      newTableIds.map((id) => ({
        reservation_id: reservation.id,
        table_id: id,
      })),
      option,
    ),
    db.ReservationTable.destroy({
      where: {
        table_id: {
          [Op.in]: canceledTableIds,
        },
      },
    }),
  ];
  return Promise.all(updatePromises);
};

const deleteReservation = async (reservationId, option = {}) => {
  const reservation = await getReservationDetail(reservationId);
  await db.ReservationTable.destroy(
    {
      where: {
        table_id: {
          [Op.in]: (reservation.tables || []).map((table) => table.id),
        },
      },
    },
    option,
  );
  return reservation.destroy();
};

module.exports = {
  createReservation,
  getReservationDetail,
  getReservationList,
  updateReservation,
  deleteReservation,
};
