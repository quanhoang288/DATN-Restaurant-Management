import api from './api'

const getStaffList = () => api.get('staff')

const getStaff = (id) => api.get(`staff/${id}`)

const createStaff = (data) => api.post('staff', data)

const updateStaff = (id, updateData) => api.put(`staff/${id}`, updateData)

const deleteStaff = (id) => api.delete(`staff/${id}`)

export { createStaff, getStaffList, getStaff, updateStaff, deleteStaff }
