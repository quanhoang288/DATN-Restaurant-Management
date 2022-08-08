import api from "./api";

const getInventoryHistories = (params = {}) =>
  api.get("inventory-histories", { params });

const getInventoryHistory = (id) => api.get(`inventory-histories/${id}`);

const createInventoryHistory = (data) => api.post("inventory-histories", data);

const updateInventoryHistory = (id, updateData) =>
  api.put(`inventory-histories/${id}`, updateData);

const deleteInventoryHistory = (id) => api.delete(`inventory-histories/${id}`);

export {
  createInventoryHistory,
  getInventoryHistories,
  getInventoryHistory,
  updateInventoryHistory,
  deleteInventoryHistory,
};
