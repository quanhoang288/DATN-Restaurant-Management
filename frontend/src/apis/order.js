import api from "./api";

const getOrders = (params = {}) => api.get("orders", { params });

const getOrder = (id) => api.get(`orders/${id}`);

const createOrder = (data) => api.post("orders", data);

const updateOrder = (id, updateData) => api.put(`orders/${id}`, updateData);

const deleteOrder = (id) => api.delete(`orders/${id}`);

const payOrder = (id, paymentData) =>
  api.post(`orders/${id}/payment`, paymentData);

const updateOrderItem = (orderId, itemId, data) =>
  api.post(`orders/items/${itemId}/update`, {
    ...data,
    order_id: orderId,
  });

const bulkUpdateKitchenItems = (itemId, status) =>
  api.post("orders/items/bulk-update", { itemId, status });

const getKitchenItems = (params = {}) => api.get("/orders/items", { params });

export {
  createOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  payOrder,
  updateOrderItem,
  getKitchenItems,
  bulkUpdateKitchenItems,
};
