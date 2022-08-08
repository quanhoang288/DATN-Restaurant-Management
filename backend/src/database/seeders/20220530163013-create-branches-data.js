module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('branches', [
      {
        name: 'Chi nhánh Hà Nội',
        address: 'Xóm 1 Xâm Động, Vân Tảo, Thường Tín',
        city: 'Hà Nội',
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Chi nhánh Đà Nẵng',
        address: '85 Duy Tân, Hòa Thuận Nam, Hải Châu, Đà Nẵng',
        city: 'Đà Nẵng',
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Chi nhánh thành phố Hồ Chí Minh',
        address: '196 Tân Hương, Tân Quý, Tân Phú, Thành phố Hồ Chí Minh',
        city: 'Hồ Chí Minh',
        is_active: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('branches', null, {});
  },
};
