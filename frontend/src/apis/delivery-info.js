import api from "./api";

const getDeliveryInfos = (params = {}) => api.get("delivery-infos", { params });

const getDeliveryInfo = (id) => api.get(`delivery-infos/${id}`);

const createDeliveryInfo = (data) => api.post("delivery-infos", data);

const updateDeliveryInfo = (id, updateData) =>
  api.put(`delivery-infos/${id}`, updateData);

const deleteDeliveryInfo = (id) => api.delete(`delivery-infos/${id}`);

export {
  createDeliveryInfo,
  getDeliveryInfos,
  getDeliveryInfo,
  updateDeliveryInfo,
  deleteDeliveryInfo,
};
