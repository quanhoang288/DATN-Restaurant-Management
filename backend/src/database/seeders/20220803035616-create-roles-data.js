module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        code: 'cashier',
        name: 'Thu ngân',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: 'server',
        name: 'Phục vụ',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: 'cook',
        name: 'Đầu bếp',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: 'bartender',
        name: 'Nhân viên pha chế',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: 'shipper',
        name: 'Nhân viên giao hàng',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        code: 'branch-manager',
        name: 'Quản lý chi nhánh',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
