import api from './api'

const getInfo = (userId) => api.get(`/users/${userId}`)

export { getInfo }

