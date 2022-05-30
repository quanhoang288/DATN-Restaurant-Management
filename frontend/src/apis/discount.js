import api from './api'

const getDiscounts = () => api.get('discounts')

const getDiscount = (id) => api.get(`discounts/${id}`)

const createDiscount = (data) => api.post('discounts', data)

const updateDiscount = (id, updateData) => api.put(`discounts/${id}`, updateData)

const deleteDiscount = (id) => api.delete(`discounts/${id}`)

export { createDiscount, getDiscounts, getDiscount, updateDiscount, deleteDiscount }
