import api from "./api";

const getDiscounts = (params = {}) => api.get("discounts", { params });

const getDiscount = (id) => {
  return api.get(`discounts/${id}`);
};

const createDiscount = (data) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }
  return api.post("discounts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
};

const updateDiscount = (id, updateData) => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(updateData)) {
    formData.append(key, value);
  }
  return api.put(`discounts/${id}`, formData);
};

const deleteDiscount = (id) => api.delete(`discounts/${id}`);

export {
  createDiscount,
  getDiscounts,
  getDiscount,
  updateDiscount,
  deleteDiscount,
};
