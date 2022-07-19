const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { reservationService } = require('../services');

const createReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.createReservation(req.body);
  res.status(httpStatus.CREATED).send(reservation);
});

const getReservations = catchAsync(async (req, res) => {
  const filter = {};
  // const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await reservationService.getReservationList(filter);
  res.send(result);
});

const getReservation = catchAsync(async (req, res) => {
  const reservation = await reservationService.getReservationDetail(
    req.params.id,
  );

  res.send(reservation);
});

const updateReservation = catchAsync(async (req, res) => {
  await reservationService.updateReservation(req.params.id, req.body);
  res.status(httpStatus.OK).json({
    message: 'Update reservation succesfully',
  });
});

const deleteReservation = catchAsync(async (req, res) => {
  await reservationService.deleteReservation(req.params.id);
  res.status(httpStatus.NO_CONTENT).json({
    message: 'Delete reservation succesfully',
  });
});

module.exports = {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
};
