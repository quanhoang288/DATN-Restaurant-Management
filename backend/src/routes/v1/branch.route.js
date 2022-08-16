const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const branchController = require('../../controllers/branch.controller');
const { branchValidation } = require('../../validations');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    branchController.createBranch,
  )
  .get(
    // auth(),
    validate(branchValidation.getBranches),
    branchController.getBranches,
  );

router
  .route('/:id')
  .get(
    // auth,
    branchController.getBranch,
  )
  .put(
    // auth,
    branchController.updateBranch,
  )
  .delete(
    // auth,
    branchController.deleteBranch,
  );

module.exports = router;
