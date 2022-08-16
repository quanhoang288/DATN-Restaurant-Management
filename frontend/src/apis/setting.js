import api from "./api";

const getSettings = (params = {}) => api.get("settings", { params });

const saveSettings = (data) => api.post("settings", data);

export { saveSettings, getSettings };
