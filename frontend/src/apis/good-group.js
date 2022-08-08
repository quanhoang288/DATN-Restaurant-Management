import api from "./api";

const getGoodGroups = (params = {}) =>
  api.get("good-groups", {
    params,
  });

const createGood = (data) => api.post("good-groups", data);

export { createGood, getGoodGroups };
