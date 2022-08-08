import api from "./api";

const getTables = (params = {}) => api.get("tables", { params });

const getTable = (id) => api.get(`tables/${id}`);

const createTable = (data) => api.post("tables", data);

const updateTable = (id, updateData) => api.put(`tables/${id}`, updateData);

const deleteTable = (id) => api.delete(`tables/${id}`);

export { createTable, getTables, getTable, updateTable, deleteTable };
