import api from "./api";

const getGoodGroups = (params = {}) =>
  api.get("good-groups", {
    params,
  });

const createGoodGroup = (data) => api.post("good-groups", data);

export { createGoodGroup, getGoodGroups };
