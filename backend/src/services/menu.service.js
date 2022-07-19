const db = require('../database/models');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db.Sequelize;

const createMenu = async (data, option = {}) => {
  const categories = data.categories || [];
  delete data.categories;

  const t = await db.sequelize.transaction();
  option.transaction = t;
  try {
    const menu = await db.Menu.create(data, option);
    const categoryPromises = generateCategoryCreatePromises(
      menu.id,
      categories,
      option,
    );
    await Promise.all(categoryPromises);
    t.commit();
    return menu;
  } catch (err) {
    console.log(err);
    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    t.rollback();
    throw err;
  }
};

const updateMenu = async (menuId, data, option = {}) => {
  const menu = await db.Menu.findByPk(menuId, {
    include: [
      {
        association: 'categories',
        include: [
          {
            association: 'items',
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });
  if (!menu) {
    throw new ApiError(
      Errors.MenuNotFound.statusCode,
      Errors.MenuNotFound.message,
    );
  }

  const categoryData = data.categories || [];
  const menuCategories = menu.categories || [];

  const newCategories = [];
  const categoriesToUpdate = [];
  const categoriesToDelete = menuCategories.filter(
    (category) =>
      category.id &&
      categoryData.findIndex((cat) => cat.id === category.id) === -1,
  );

  categoryData.forEach((category) => {
    if (!category.id) {
      newCategories.push(category);
    } else {
      categoriesToUpdate.push(category);
    }
  });
  delete data.categories;
  menu.set(data);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const updatePromises = [
    ...generateCategoryCreatePromises(menu.id, newCategories, option),
    ...categoriesToUpdate.map(async (categoryToUpdate) => {
      const category = menuCategories.find(
        (cat) => cat.id === categoryToUpdate.id,
      );
      const newItems = categoryToUpdate.items || [];
      delete categoryToUpdate.items;
      category.set(categoryToUpdate);
      category.setItems(newItems);
      return category.save(option);
    }),
    menu.save(option),
  ];

  if (categoriesToDelete.length > 0) {
    updatePromises.push(menu.removeCategories(categoriesToDelete, option));
  }

  try {
    await Promise.all(updatePromises);
    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getMenus = async () =>
  db.Menu.findAll({
    include: [
      {
        association: 'categories',
        include: [
          {
            association: 'items',
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });

const getMenu = async (menuId) => {
  const menu = db.Menu.findByPk(menuId, {
    include: [
      {
        association: 'categories',
        include: [
          {
            association: 'items',
            attributes: ['id', 'name', 'sale_price'],
            through: {
              attributes: [],
            },
          },
        ],
      },
    ],
  });
  if (!menu) {
    throw new ApiError(
      Errors.MenuNotFound.statusCode,
      Errors.MenuNotFound.message,
    );
  }
  return menu;
};

const deleteMenu = async (menuId, option = {}) => {
  const menu = await db.Menu.findByPk(menuId, {
    include: [
      {
        association: 'categories',
        include: [
          {
            association: 'items',
            through: {
              attributes: ['id'],
            },
          },
        ],
      },
    ],
  });
  if (!menu) {
    throw new ApiError(
      Errors.MenuNotFound.statusCode,
      Errors.MenuNotFound.message,
    );
  }

  const menuCategories = menu.categories || [];
  const categoryItemIdsToDelete = menuCategories.reduce(
    (prevIds, category) =>
      prevIds.concat(
        (category.items || []).map((item) => item.CategoryItem.id),
      ),
    [],
  );

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await db.CategoryItem.destroy({
      where: {
        id: {
          [Op.in]: categoryItemIdsToDelete,
        },
      },
      ...option,
    });
    await db.MenuCategory.destroy({
      where: {
        id: {
          [Op.in]: menuCategories.map((cat) => cat.id),
        },
      },
      ...option,
    });
    await menu.destroy(option);
    t.commit();
  } catch (err) {
    t.rollback();
    throw err;
  }
};

const getMenuCategory = async (menuId, categoryId) => {
  const category = db.MenuCategory.findOne({
    where: {
      menu_id: menuId,
      id: categoryId,
    },
    include: [
      {
        association: 'items',
        attributes: ['id', 'name', 'sale_price'],
        through: {
          attributes: [],
        },
      },
    ],
  });
  if (!category) {
    throw new ApiError(
      Errors.MenuCategoryNotFound.statusCode,
      Errors.MenuCategoryNotFound.message,
    );
  }
  return category;
};

const generateCategoryCreatePromises = (menuId, categories, option = {}) =>
  categories.map(async (categoryData) => {
    const { items } = categoryData;
    delete categoryData.items;

    const category = await db.MenuCategory.create(
      {
        ...categoryData,
        menu_id: menuId,
      },
      option,
    );
    return category.addItems(items, option);
  });

module.exports = {
  createMenu,
  updateMenu,
  getMenu,
  getMenus,
  deleteMenu,
  getMenuCategory,
};
