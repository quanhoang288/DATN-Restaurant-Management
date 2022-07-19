module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('generating menu data...');
    const menus = await queryInterface.bulkInsert(
      'menus',
      [
        {
          name: 'Đồ ăn 1',
          type: 'food',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {
        returning: true,
      },
    );

    await queryInterface.bulkInsert(
      'menu_categories',
      [
        {
          menu_id: 1,
          name: 'Đồ ăn xào/ nướng',
          order: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          menu_id: 1,
          name: 'Đồ ăn chay',
          order: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true },
    );

    await queryInterface.bulkInsert('category_items', [
      {
        category_id: 1,
        good_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 2,
        good_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category_id: 1,
        good_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    console.log('generate completed');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('category_items', null, {});
    await queryInterface.bulkDelete('menu_categories', null, {});
    await queryInterface.bulkDelete('menus', null, {});
  },
};
