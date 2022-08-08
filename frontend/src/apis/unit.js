import api from "./api";

const getUnits = (params = {}) => api.get("units", { params });

const createUnit = (data) => api.post("units", data);

export { createUnit, getUnits };
