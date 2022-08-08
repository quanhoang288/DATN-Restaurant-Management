import api from "./api";

const getRoles = (params = {}) => api.get("roles", { params });

const getRole = (id) => api.get(`roles/${id}`);

const createRole = (data) => api.post("roles", data);

const updateRole = (id, updateData) => api.put(`roles/${id}`, updateData);

const deleteRole = (id) => api.delete(`roles/${id}`);

export { createRole, getRoles, getRole, updateRole, deleteRole };
