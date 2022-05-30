import api from './api'

const getGoods = () => api.get('goods')

const getGood = (id) => api.get(`goods/${id}`)

const createGood = (data) => api.post('goods', data)

const updateGood = (id, updateData) => api.put(`goods/${id}`, updateData)

const deleteGood = (id) => api.delete(`goods/${id}`)

export { createGood, getGoods, getGood, updateGood, deleteGood }
