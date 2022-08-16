import api from "./api";

const getReservations = (params = {}) => api.get("reservations", { params });

const getReservation = (id) => api.get(`reservations/${id}`);

const createReservation = (data) => api.post("reservations", data);

const updateReservation = (id, updateData) =>
  api.put(`reservations/${id}`, updateData);

const deleteReservation = (id) => api.delete(`reservations/${id}`);

export {
  createReservation,
  getReservations,
  getReservation,
  updateReservation,
  deleteReservation,
};
