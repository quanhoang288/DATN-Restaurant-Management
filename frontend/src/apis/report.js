import api from "./api";

const getTodayReport = (params = {}) =>
  api.get("reports/today-report", { params });

const getMonthlyRevenueReport = (params = {}) =>
  api.get("reports/monthly-revenue-report", { params });

const getMonthlyCustomerReport = (params = {}) =>
  api.get("reports/monthly-customer-report", { params });

const getFavoriteItems = (params = {}) =>
  api.get("reports/favorite-items", { params });

export {
  getTodayReport,
  getMonthlyCustomerReport,
  getMonthlyRevenueReport,
  getFavoriteItems,
};
