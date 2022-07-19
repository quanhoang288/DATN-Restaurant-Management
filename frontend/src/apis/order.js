import api from './api'

const getOrders = () => api.get('orders')

const getOrder = (id) => api.get(`orders/${id}`)

const createOrder = (data) => api.post('orders', data)

const updateOrder = (id, updateData) => api.put(`orders/${id}`, updateData)

const deleteOrder = (id) => api.delete(`orders/${id}`)

const payOrder = (id, paymentData) => api.post(`orders/${id}/payment`, paymentData)

const updateOrderItem = (orderId, itemId, data) => api.post(`orders/${orderId}/items/${itemId}/update`, data)

export { createOrder, getOrders, getOrder, updateOrder, deleteOrder, payOrder, updateOrderItem }

