const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelizePaginate = require('../pagination');
const config = require('../../config/config');

const basename = path.basename(__dirname);

const sequelizeConfig = {
  dialect: 'mysql',
  dialectOptions: {
    charset: 'utf8mb4',
  },
  logging: console.log,
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
    defaultScope: {
      attributes: {
        exclude: ['created_at', 'updated_at', 'deleted_at'],
      },
    },
  },
  migrationStorageTableName: 'migrations',
  seederStorageTableName: 'seeders',
  logging: false,
};

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    ...sequelizeConfig,
    port: config.db.port,
  },
);

const db = {};

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file !== 'index.js' &&
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js',
  )
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  sequelizePaginate.paginate(db[modelName]);
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
