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
const filter = (Op, filter, where = {}) => {
  if (typeof filter === 'object') {
    // eslint-disable-next-line guard-for-in
    for (const key in filter) {
      for (const index in filter[key]) {
        if (key === 'like') {
          where[index] = {
            [Op.substring]: filter[key][index].trim(),
          };
        } else if (key === 'equal') {
          where[index] = filter[key][index];
        }
      }
    }
  }
  return where;
};

module.exports = {
  getPagingData,
  filter,
};
