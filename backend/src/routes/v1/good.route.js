const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const goodValidation = require('../../validations/good.validation');
const goodController = require('../../controllers/good.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(goodValidation.createGood), goodController.createGood)
  .get(validate(goodValidation.getGoods), goodController.getGoodList);

router
  .route('/:id')
  .get(validate(goodValidation.getGood), goodController.getGoodDetail)
  .put(validate(goodValidation.updateGood), goodController.updateGood)
  .delete(validate(goodValidation.deleteGood), goodController.deleteGood);

module.exports = router;
