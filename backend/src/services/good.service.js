const db = require('../database/models');
const query = require('../utils/query');
const ApiError = require('../exceptions/api-error');
const Errors = require('../exceptions/custom-error');

const { Op } = db;

const createGood = async (data, option = {}) => {
  console.log('good data: ', data);
  const duplicateNameGood = await db.Good.findOne({
    where: {
      name: data.name,
    },
  });
  console.log(duplicateNameGood);
  if (duplicateNameGood) {
    throw new ApiError(
      Errors.DuplicateGoodName.statusCode,
      Errors.DuplicateGoodName.message,
    );
  }
  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    const good = await db.Good.create(data, {
      include: [
        {
          association: 'components',
          ...option,
        },
        {
          association: 'attributes',
          include: [
            {
              association: 'values',
              ...option,
            },
          ],
          ...option,
        },
        {
          association: 'units',
          ...option,
        },
      ],
    });
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

const getGoodList = async (params = {}) => {
  const filter = params.filter || {};
  const sort = params.sort || [];

  if (params.page) {
    const items = await db.Good.paginate({
      page: params.page,
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
};

const getGoodDetail = async (goodId) => {
  try {
    const good = await db.Good.findOne({
      where: {
        id: goodId,
      },
      include: [
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
  const attributeData = data.attributes || [];
  const unitData = data.units || [];
  const componentData = data.components || [];
  delete data.attributes;
  delete data.units;
  delete data.components;

  good.set(data);

  const t = await db.sequelize.transaction();
  option.transaction = t;

  try {
    await Promise.all([
      ...good.attributes.map(async (attr) => {
        await attr.removeValues(attr.values, option);
        return attr.destroy(option);
      }),
      good.removeUnits(good.units),
      good.removeComponents(good.components),
    ]);
    await Promise.all([
      attributeData.map((attr) =>
        db.GoodAttribute.create(
          { ...attr, good_id: good.id },
          {
            include: [
              {
                association: 'values',
              },
            ],
            ...option,
          },
        ),
      ),
      db.GoodUnit.bulkCreate(
        unitData.map((unit) => ({ ...unit, good_id: good.id })),
      ),
      db.GoodComponent.bulkCreate(
        componentData.map((comp) => ({
          good_id: good.id,
          component_id: comp.good_id,
          quantity: comp.quantity,
        })),
      ),
      good.save(option),
    ]);
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
    ...good.attributes.map(async (attr) => {
      await attr.removeValues(attr.values, option);
      return attr.destroy(option);
    }),
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
