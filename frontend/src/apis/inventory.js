import api from "./api";

const getInventories = (params = {}) => api.get("inventories", { params });

const getInventory = (id) => api.get(`inventories/${id}`);

const createInventory = (data) => api.post("inventories", data);

const updateInventory = (id, updateData) =>
  api.put(`inventories/${id}`, updateData);

const deleteInventory = (id) => api.delete(`inventories/${id}`);

export {
  createInventory,
  getInventories,
  getInventory,
  updateInventory,
  deleteInventory,
};
