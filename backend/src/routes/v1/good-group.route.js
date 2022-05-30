const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { goodGroupValidation } = require('../../validations');
const { goodGroupController } = require('../../controllers');

const router = express.Router();

router
  .route('/')
  .post(
    auth,
    validate(goodGroupValidation.createGoodGroup),
    goodGroupController.createGoodGroup,
  )
  .get(
    auth,
    validate(goodGroupValidation.getGoodGroups),
    goodGroupController.getGoodGroupList,
  );

router
  .route('/:id')
  .get(
    auth,
    validate(goodGroupValidation.getGoodGroup),
    goodGroupController.getGoodGroupDetail,
  )
  .put(
    auth,
    validate(goodGroupValidation.updateGoodGroup),
    goodGroupController.updateGoodGroup,
  )
  .delete(
    auth,
    validate(goodGroupValidation.deleteGoodGroup),
    goodGroupController.deleteGoodGroup,
  );

module.exports = router;
