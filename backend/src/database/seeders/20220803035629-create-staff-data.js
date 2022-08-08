const bcrypt = require('bcryptjs');
const pick = require('../../utils/pick');
const db = require('../models');

const { Op } = db.Sequelize;

module.exports = {
  async up(queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash('123456', salt);

    const staffData = [
      {
        email: 'thungan1@gmail.com',
        password: hashedPassword,
        full_name: 'Thu ngan 1',
        role_id: 1,
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'phucvu1@gmail.com',
        password: hashedPassword,
        full_name: 'Phuc vu 1',
        role_id: 2,
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'daubep1@gmail.com',
        password: hashedPassword,
        full_name: 'Dau bep 1',
        role_id: 3,
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'phache1@gmail.com',
        password: hashedPassword,
        full_name: 'Pha che 1',
        role_id: 4,
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'shipper1@gmail.com',
        password: hashedPassword,
        full_name: 'Shipper 1',
        role_id: 5,
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'shipper2@gmail.com',
        password: hashedPassword,
        full_name: 'Shipper 2',
        role_id: 5,
        branch_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'shipper3@gmail.com',
        password: hashedPassword,
        full_name: 'Shipper 3',
        role_id: 5,
        branch_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert(
      'users',
      staffData.map((data) =>
        pick(data, [
          'email',
          'password',
          'full_name',
          'created_at',
          'updated_at',
        ]),
      ),
    );

    const users = await db.User.findAll({
      where: {
        email: {
          [Op.in]: staffData.map((staff) => staff.email),
        },
      },
    });

    await queryInterface.bulkInsert(
      'staff',
      users.map((user) => ({
        id: user.id,
        role_id: staffData.find((data) => data.email === user.email).role_id,
      })),
    );
  },

  async down(queryInterface, Sequelize) {
    const users = await db.User.find({
      where: {
        email: {
          [Op.ne]: 'admin@gmail.com',
        },
      },
      include: [
        {
          association: 'staff',
          require: true,
        },
      ],
    });
    await queryInterface.delete('staff', {
      where: {
        id: {
          [Op.in]: users.map((user) => user.staff.id),
        },
      },
    });
    await queryInterface.delete('users', {
      where: {
        id: {
          [Op.in]: users.map((user) => user.id),
        },
      },
    });
  },
};
