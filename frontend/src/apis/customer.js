import api from "./api";

const getCustomers = (params = {}) => api.get("customers", { params });

const getCustomer = (id) => api.get(`customers/${id}`);

export { getCustomers, getCustomer };
