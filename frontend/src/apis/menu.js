import api from "./api";

const getMenus = (params = {}) => api.get("menus", { params });

const getMenu = (id) => api.get(`menus/${id}`);

const createMenu = (data) => {
  const formData = new FormData();
  for (const [key, val] of Object.entries(data)) {
    formData.append(key, val);
  }
  return api.post("menus", formData);
};

const updateMenu = (id, updateData) => {
  const formData = new FormData();
  for (const [key, val] of Object.entries(updateData)) {
    formData.append(key, val);
  }
  return api.put(`menus/${id}`, formData);
};

const deleteMenu = (id) => api.delete(`menus/${id}`);

const getMenuCategory = (menuId, categoryId) =>
  api.get(`menus/${menuId}/categories/${categoryId}`);

export {
  createMenu,
  getMenus,
  getMenu,
  updateMenu,
  deleteMenu,
  getMenuCategory,
};
