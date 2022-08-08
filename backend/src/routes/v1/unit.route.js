const express = require('express');
// const auth = require('../../middlewares/auth');
const unitController = require('../../controllers/unit.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    unitController.createUnit,
  )
  .get(
    // auth,
    unitController.getUnits,
  );

module.exports = router;
