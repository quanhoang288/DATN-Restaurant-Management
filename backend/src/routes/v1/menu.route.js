const express = require('express');
const validate = require('../../middlewares/validate');
// const auth = require('../../middlewares/auth');
const menuValidation = require('../../validations/menu.validation');
const menuController = require('../../controllers/menu.controller');
const upload = require('../../middlewares/upload');

const router = express.Router();

router
  .route('/')
  .post(
    // auth,
    upload.single('image'),
    validate(menuValidation.createMenu),
    menuController.createMenu,
  )
  .get(
    // auth,
    validate(menuValidation.getMenus),
    menuController.getMenus,
  );

router.get('/:id/categories/:categoryId', menuController.getMenuCategory);

router
  .route('/:id')
  .get(
    // auth,
    validate(menuValidation.getMenu),
    menuController.getMenu,
  )
  .put(
    // auth,
    upload.single('image'),

    validate(menuValidation.updateMenu),
    menuController.updateMenu,
  )
  .delete(
    // auth,
    validate(menuValidation.deleteMenu),
    menuController.deleteMenu,
  );

module.exports = router;
