import api from './api'

const getMenus = () => api.get('notifications')

const createMenu = (data) => api.post('notifications', data)

export { createMenu, getMenus }

