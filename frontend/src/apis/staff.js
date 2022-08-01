import api from './api'

const getStaffList = () => api.get('staff')

const getStaff = (id) => api.get(`staff/${id}`)

const createStaff = (data = {}) => {
  const formData = new FormData()
  for (const [key, value] of Object.entries(data)) {
    if (key === 'avatar') {
      formData.append('image', value)
    } else {
      formData.append(key, value)
    }
  }
  return api.post('staff', formData)
}

const updateStaff = (id, updateData) => api.put(`staff/${id}`, updateData)

const deleteStaff = (id) => api.delete(`staff/${id}`)

export { createStaff, getStaffList, getStaff, updateStaff, deleteStaff }

