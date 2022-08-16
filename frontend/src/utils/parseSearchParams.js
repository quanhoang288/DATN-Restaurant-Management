export const parseSearchParams = (params = {}) => {
  return Object.keys(params || {}).reduce((res, key) => {
    if (typeof params[key] === "object") {
      params[key] = parseSearchParams(params[key]);
      if (Object.keys(params[key]).length > 0) {
        res[key] = params[key];
      }
    } else if (params[key]) {
      res[key] = params[key];
    }
    return res;
  }, {});
};
