const express = require('express');
// const auth = require('../../middlewares/auth');
const roleController = require('../../controllers/role.controller');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    roleController.createRole,
  )
  .get(
    // auth,
    roleController.getRoles,
  );

router
  .route('/:id')
  .get(
    // auth,
    roleController.getRole,
  )
  .put(
    // auth,
    roleController.updateRole,
  )
  .delete(
    // auth,
    roleController.deleteRole,
  );

module.exports = router;
