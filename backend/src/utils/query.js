/**
 * Prepare data for pagination
 * @param items
 * @param page
 * @param limit
 * @returns {{per_page: number, total, data, last_page, from: null, to: null, current_page: number}}
 */
const getPagingData = (items, page, limit) => {
  const { total, pages: lastPage, docs: data } = items;
  const currentPage = page ? +page : 0;
  const perPage = limit ? +limit : 20;
  const from = data.length > 0 ? (currentPage - 1) * limit + 1 : null;
  const to = data.length > 0 ? from + data.length - 1 : null;

  return {
    data,
    current_page: currentPage,
    last_page: lastPage,
    per_page: perPage,
    from,
    to,
    total,
  };
};

/**
 * Filter - condition for query
 * @param Op
 * @param filter
 * @param where
 * @returns {{}}
 */
// eslint-disable-next-line no-shadow
const filter = (Op, filter) => {
  const where = {};
  if (typeof filter === 'object') {
    // eslint-disable-next-line guard-for-in
    for (const key in filter) {
      if (typeof filter[key] === 'object') {
        for (const [cond, val] of Object.entries(filter[key])) {
          switch (cond) {
            case 'like': {
              where[key] = {
                [Op.substring]: val,
              };
              break;
            }
            case 'ne': {
              where[key] = {
                [Op.ne]: val,
              };
              break;
            }
            case 'in': {
              where[key] = {
                [Op.in]: val,
              };
              break;
            }
            case 'notIn': {
              where[key] = {
                [Op.notIn]: val,
              };
              break;
            }
            default:
              where[key] = val;
          }
        }
      } else {
        where[key] = filter[key];
      }
    }
  }
  return where;
};

module.exports = {
  getPagingData,
  filter,
};
