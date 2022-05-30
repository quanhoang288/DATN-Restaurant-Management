import api from './api'

const getMenus = () => api.get('menus')

const getMenu = (id) => api.get(`menus/${id}`)

const createMenu = (data) => api.post('menus', data)

const updateMenu = (id, updateData) => api.put(`menus/${id}`, updateData)

const deleteMenu = (id) => api.delete(`menus/${id}`)

const getMenuCategory = (menuId, categoryId) => api.get(`menus/${menuId}/categories/${categoryId}`)

export { createMenu, getMenus, getMenu, updateMenu, deleteMenu, getMenuCategory }

