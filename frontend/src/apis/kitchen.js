import api from './api'

const getKitchens = () => api.get('kitchens')

const getKitchen = (id) => api.get(`kitchens/${id}`)

const createKitchen = (data) => api.post('kitchens', data)

const updateKitchen = (id, updateData) => api.put(`kitchens/${id}`, updateData)

const deleteKitchen = (id) => api.delete(`kitchens/${id}`)

export { createKitchen, getKitchens, getKitchen, updateKitchen, deleteKitchen }
