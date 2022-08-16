import api from "./api";

const getGoods = (params = {}) =>
  api.get("goods", {
    params,
  });

const getGood = (id) => api.get(`goods/${id}`);

const createGood = (data) => {
  const formData = new FormData();
  for (const [key, val] of Object.entries(data)) {
    formData.append(key, val);
  }
  return api.post("goods", formData);
};
const updateGood = (id, data) => {
  const formData = new FormData();
  for (const [key, val] of Object.entries(data)) {
    formData.append(key, val);
  }
  return api.put(`goods/${id}`, formData);
};
const deleteGood = (id) => api.delete(`goods/${id}`);

export { createGood, getGoods, getGood, updateGood, deleteGood };
