const db = require('../database/models');
const query = require('../utils/query');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db;

const createGood = async (data, option = {}) => {
  const duplicateNameGood = await db.Good.findOne({
    name: data.name,
  });
  console.log(duplicateNameGood);
  if (duplicateNameGood) {
    console.log(duplicateNameGood);
    throw new ApiError(
      Errors.DuplicateGoodName.statusCode,
      Errors.DuplicateGoodName.message,
    );
  }
  const t = await db.sequelize.transaction();

  try {
    const res = await db.Good.create(data, {
      ...option,
      transaction: t,
      // include: [
      //   {
      //     association: 'components',
      //     ...option,
      //   },
      //   {
      //     association: 'attributes',
      //     include: [
      //       {
      //         association: 'values',
      //         ...option,
      //       },
      //     ],
      //     ...option,
      //   },
      //   {
      //     association: 'units',
      //     ...option,
      //   },
      // ],
    });
    console.log('res: ', res);
    // If the execution reaches this line, no errors were thrown.
    // We commit the transaction.
    await t.commit();
  } catch (err) {
    console.log(err);
    // If the execution reaches this line, an error was thrown.
    // We rollback the transaction.
    t.rollback();
    throw err;
  }
};

const getGoodList = async (params = {}) => {
  const filter = params.filter || {};
  const sort = params.sort || [];

  if (params.page) {
    const items = await db.Good.paginate({
      page: params.page || 1,
      paginate: params.limit || 10,
      where: query.filter(Op, filter),
      order: sort,
    });

    return query.getPagingData(items, params.page, params.limit);
  }

  const option = {
    where: filter,
    sort,
  };
  if (params.attributes) {
    option.attributes = params.attributes;
  }

  return db.Good.findAll(option);

  // try {
  //   const items = await db.Good.paginate({
  //     page: params.page || 1,
  //     paginate: params.limit || 10,
  //     where: query.filter(Op, filter),
  //     order: sort,
  //   });

  //   return query.getPagingData(items, params.page, params.limit);
  // } catch (err) {
  //   console.log(err);
  // }
};

const getGoodDetail = async (goodId) => {
  const good = db.Good.findOne({
    where: {
      id: goodId,
    },
    include: [
      {
        association: 'group',
        attributes: ['id', 'name'],
      },
      {
        association: 'components',
        attributes: ['id', 'name'],
      },
      {
        association: 'attributes',
        attributes: ['id', 'name'],
        include: [
          {
            association: 'values',
            attributes: ['id', 'name', 'attribute_id'],
          },
        ],
      },
      {
        association: 'units',
        attributes: ['id', 'name'],
      },
    ],
  });
  if (!good) {
    const { statusCode, message } = Errors.GoodNotFound;
    throw new ApiError(statusCode, message);
  }
  return good;
};

const updateGood = async (goodId, data, option = {}) => {
  const updatePromises = [];
  const good = await getGoodDetail(goodId);
  if (!good) {
    throw new ApiError(
      Errors.GoodNotFound.statusCode,
      Errors.GoodNotFound.message,
    );
  }
  const duplicateNameGood = await db.Good.findOne({
    name: data.name,
    id: {
      [Op.ne]: goodId,
    },
  });
  if (duplicateNameGood) {
    throw new ApiError(
      Errors.DuplicateGoodName.statusCode,
      Errors.DuplicateGoodName.message,
    );
  }
  if (data.attributes) {
    // todo: save attributes

    delete data.attributes;
  }
  if (data.units) {
    // todo: save units
    delete data.units;
  }
  if (data.group) {
    // todo: save good groups
    if (good.group.id !== data.group.id) {
      good.set({ group_id: data.group.id });
    }
    delete data.group;
  }
  if (data.components) {
    // todo: save components
    delete data.components;
  }
  await Promise.all(updatePromises);
  good.set(data);
  return good.save(option);
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
    ...good.units.map((unit) => unit.destroy(option)),
    ...good.attributes.map(
      (attr) =>
        new Promise((resolve) => {
          const valueDestroyPromises = attr.values.map((val) =>
            val.destroy(option),
          );
          Promise.all(valueDestroyPromises).then(() =>
            resolve(attr.destroy(option)),
          );
        }),
    ),
  ];
  await Promise.all(deletePromises);
  return good.destroy(option);
};

module.exports = {
  createGood,
  updateGood,
  getGoodList,
  getGoodDetail,
  deleteGood,
};
