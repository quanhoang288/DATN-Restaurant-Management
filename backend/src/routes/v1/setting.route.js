const express = require('express');
// const auth = require('../../middlewares/auth');
const settingController = require('../../controllers/setting.controller');
const validate = require('../../middlewares/validate');
const { settingValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    validate(settingValidation.saveSettings),
    settingController.saveSettings,
  )
  .get(
    // auth,
    settingController.getSettings,
  );

module.exports = router;
