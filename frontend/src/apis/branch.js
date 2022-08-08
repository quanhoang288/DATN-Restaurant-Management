import api from "./api";

const getBranches = (params = {}) => api.get("branches", { params });

const getBranch = (id) => api.get(`branches/${id}`);

const createBranch = (data) => api.post("branches", data);

const updateBranch = (id, updateData) => api.put(`branches/${id}`, updateData);

const deleteBranch = (id) => api.delete(`branches/${id}`);

export { createBranch, getBranches, getBranch, updateBranch, deleteBranch };
