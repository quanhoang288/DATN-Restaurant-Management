import api from "./api";

const createInvoice = (data) => api.post("invoices", data);

const getInvoice = (invoiceId) => api.get(`invoices/${invoiceId}`);

export { createInvoice, getInvoice };
