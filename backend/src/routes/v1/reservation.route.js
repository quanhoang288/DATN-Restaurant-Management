const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const reservationValidation = require('../../validations/reservation.validation');
const reservationController = require('../../controllers/reservation.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    validate(reservationValidation.createReservation),
    reservationController.createReservation,
  )
  .get(
    // auth,
    validate(reservationValidation.getReservations),
    reservationController.getReservations,
  );

router
  .route('/:id')
  .get(
    // auth,
    validate(reservationValidation.getReservation),
    reservationController.getReservation,
  )
  .put(
    // auth,
    validate(reservationValidation.updateReservation),
    reservationController.updateReservation,
  )
  .delete(
    // auth,
    validate(reservationValidation.deleteReservation),
    reservationController.deleteReservation,
  );

module.exports = router;
