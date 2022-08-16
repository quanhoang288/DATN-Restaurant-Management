const fs = require('fs');
const db = require('../database/models');
const query = require('../utils/query');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');
const parseFile = require('../utils/excelParser');
const s3Service = require('./s3.service');

const { Op } = db.Sequelize;

const createGood = async (data, option = {}) => {
  const duplicateNameGood = await db.Good.findOne({
    where: {
      name: data.name,
    },
  });
  if (duplicateNameGood) {
    console.log(duplicateNameGood);
    throw new ApiError(
      Errors.DuplicateGoodName.statusCode,
      Errors.DuplicateGoodName.message,
    );
  }

  if (data.image) {
    const tmpFile = data.image;

    const uploadRes = await s3Service.uploadFile(
      tmpFile.path,
      tmpFile.filename,
    );
    console.log('upload result: ', uploadRes);
    fs.unlinkSync(tmpFile.path);
    data.image = uploadRes.Key;
  }

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    const good = await db.Good.create(data, option);
    if (data.units) {
      await db.GoodUnit.bulkCreate(
        data.units.map((unit) => ({
          unit_id: unit.id,
          good_id: good.id,
          multiplier: unit.multiplier,
        })),
        option,
      );
    }
    if (data.components) {
      await db.GoodComponent.bulkCreate(
        data.components.map((component) => ({
          good_id: good.id,
          component_id: component.id,
          unit_id: component.unit_id,
          quantity: component.quantity,
        })),
        option,
      );
    }
    await t.commit();
    return good;
  } catch (err) {
    console.log(err);
    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    t.rollback();
    throw err;
  }
};

const importGoods = async (fileToImport, option = {}) => {
  const rows = await parseFile(fileToImport.path);
  await db.Good.bulkCreate(rows, option);
  fs.unlinkSync(fileToImport.path);
};

const getGoodList = async (params = {}) => {
  const filters = params.filters || {};
  const sort = params.sort || [['created_at', 'DESC']];

  // eslint-disable-next-line no-prototype-builtins
  if (params.hasOwnProperty('page')) {
    const items = await db.Good.paginate({
      page: params.page || 1,
      perPage: params.perPage || 5,
      where: query.filter(Op, filters),
      order: sort,
    });

    return query.getPagingData(items, params.page, params.perPage);
  }

  const option = {
    where: query.filter(Op, filters),
    sort,
  };

  console.log(option);
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Good.findAll(option);
};

const getGoodDetail = async (goodId, params = {}) => {
  // const branchId = params.filters?.branch_id || null;

  try {
    const good = await db.Good.findOne({
      where: {
        id: goodId,
      },
      include: [
        {
          association: 'components',
        },
        {
          association: 'units',
        },
        {
          association: 'attributes',
        },
        {
          association: 'inventories',
        },
      ],
    });
    if (!good) {
      const { statusCode, message } = Errors.GoodNotFound;
      throw new ApiError(statusCode, message);
    }

    console.log('good detail: ', good);

    return good;
  } catch (error) {
    console.log(error);
  }
};

const updateGood = async (goodId, data, option = {}) => {
  const good = await getGoodDetail(goodId);
  if (!good) {
    throw new ApiError(
      Errors.GoodNotFound.statusCode,
      Errors.GoodNotFound.message,
    );
  }

  const duplicateNameGood = await db.Good.findOne({
    where: {
      name: data.name || null,
      id: {
        [Op.ne]: goodId,
      },
    },
  });
  if (duplicateNameGood) {
    throw new ApiError(
      Errors.DuplicateGoodName.statusCode,
      Errors.DuplicateGoodName.message,
    );
  }

  if (data.image) {
    const tmpFile = data.image;

    const uploadRes = await s3Service.uploadFile(
      tmpFile.path,
      tmpFile.filename,
    );
    console.log('upload result: ', uploadRes);
    fs.unlinkSync(tmpFile.path);
    data.image = uploadRes.Key;
  }

  good.set(data);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  const updatePromises = [good.save(option)];

  try {
    await Promise.all(updatePromises);
    await t.commit();
  } catch (err) {
    t.throwback();
    throw err;
  }
};

const deleteGood = async (goodId, option = {}) => {
  const good = await getGoodDetail(goodId);
  if (!good) {
    throw new ApiError(
      Errors.GoodNotFound.statusCode,
      Errors.GoodNotFound.message,
    );
  }
  const deletePromises = [
    good.removeUnits(good.units, option),
    db.GoodComponent.destroy({
      where: {
        [Op.or]: [{ good_id: goodId }, { component_id: goodId }],
      },
      ...option,
    }),
    db.GoodAttribute.destroy({
      where: {
        good_id: goodId,
      },
      ...option,
    }),
    db.GoodInventory.destroy({
      where: {
        good_id: goodId,
      },
      ...option,
    }),
    db.CategoryItem.destroy({
      where: {
        good_id: goodId,
      },
      ...option,
    }),
  ];
  await Promise.all(deletePromises);
  return good.destroy(option);
};

module.exports = {
  createGood,
  importGoods,
  updateGood,
  getGoodList,
  getGoodDetail,
  deleteGood,
};
