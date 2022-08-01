import api from './api'

const createInvoice = (data) => api.post('invoices', data)

export { createInvoice }

