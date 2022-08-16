const Joi = require('joi');

const createReservation = {
  body: Joi.object().keys({
    arrive_time: Joi.string().required().min(1),
    customer_id: Joi.number().positive().allow(null),
    customer_name: Joi.string().allow(null),
    customer_phone_number: Joi.string().required(),
    num_people: Joi.number().positive().required(),
    note: Joi.string().allow(null, ''),
    tables: Joi.array().items(Joi.number().positive()),
    status: Joi.string()
      .valid('pending', 'confirmed', 'serving')
      .default('pending'),
  }),
};

const getReservations = {
  query: Joi.object().keys({
    page: Joi.number().positive(),
    perPage: Joi.number().positive(),
    filters: Joi.string(),
  }),
};

const getReservation = {};

const updateReservation = {
  params: Joi.object().keys({
    id: Joi.number().required(),
  }),
  body: Joi.object().keys({
    arrive_time: Joi.string().min(1),
    // customer_id: Joi.number().positive(),
    // customer_name: Joi.string().min(1),
    customer_phone_number: Joi.string(),
    num_people: Joi.number().positive(),
    note: Joi.string().allow(''),
    tables: Joi.array().items(Joi.number().positive()),
    status: Joi.string()
      .valid('pending', 'confirmed', 'serving')
      .default('pending'),
  }),
};

const deleteReservation = {};

module.exports = {
  createReservation,
  getReservation,
  getReservations,
  updateReservation,
  deleteReservation,
};
