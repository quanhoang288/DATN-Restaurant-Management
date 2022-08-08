/**
 * Class to paginate sequelize results.
 */
class SequelizePaginate {
  /** @typedef {import('sequelize').Model} Model */
  /**
   * Method to append paginate method to Model.
   *
   * @param {Model} Model - Sequelize Model.
   * @returns {*} -
   * @example
   * const sequelizePaginate = require('sequelize-paginate')
   *
   * sequelizePaginate.paginate(MyModel)
   */
  paginate(Model) {
    /**
     * @typedef {Object} Paginate Sequelize query options
     * @property {number} [paginate=25] Results per page
     * @property {number} [page=1] Number of page
     */
    /**
     * @typedef {import('sequelize').FindOptions & Paginate} paginateOptions
     */
    /**
     * The paginate result
     * @typedef {Object} PaginateResult
     * @property {Array} docs Docs
     * @property {number} pages Number of page
     * @property {number} total Total of docs
     */
    /**
     * Pagination.
     *
     * @param page
     * @param perPage
     * @param {paginateOptions} [params] - Options to filter query.
     * @returns {Promise<PaginateResult>} Total pages and docs.
     * @example
     * const { docs, pages, total } = await MyModel.paginate({ page: 1, perPage: 25 })
     * @member of Model
     */
    async function pagination({ page = 1, perPage = 30, ...params } = {}) {
      const options = { ...params };

      let total = await this.count(params);

      if (options.group !== undefined) {
        total = total.length;
      }

      const pages = Math.ceil(total / perPage);
      options.limit = perPage;
      options.offset = perPage * (page - 1);

      if (params.order) options.order = params.order;
      const docs = await this.findAll(options);
      console.log(docs);
      return { docs, pages, total };
    }
    const instanceOrModel = Model.Instance || Model;
    instanceOrModel.paginate = pagination;
  }
}

module.exports = new SequelizePaginate();
