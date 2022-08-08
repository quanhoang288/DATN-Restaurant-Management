const config = require('../../config/config');

module.exports = {
  development: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
      // defaultScope: {
      //   attributes: {
      //     exclude: ['created_at', 'updated_at', 'deleted_at'],
      //   },
      // },
    },
    migrationStorageTableName: 'migrations',
    seederStorageTableName: 'seeders',
  },
  test: {
    username: config.db.username,
    password: config.db.password,
    database: config.db.database,
    host: config.db.host,
    port: config.db.port,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    define: {
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      paranoid: true,
      deletedAt: 'deleted_at',
      // defaultScope: {
      //   attributes: {
      //     exclude: ['created_at', 'updated_at', 'deleted_at'],
      //   },
      // },
    },
  },
};
