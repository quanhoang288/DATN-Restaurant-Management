import api from './api'

const getNotifications = (params = {}) => api.get('notifications', { params })

const createNotification = (data) => api.post('notifications', data)

const updateNotificationReadStatus = (notificationId, userId) => api.put(`notifications/${notificationId}`, { userId })

export { createNotification, getNotifications, updateNotificationReadStatus }

