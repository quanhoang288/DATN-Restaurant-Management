export const parseSearchParams = (params = {}) => {
  console.log(params);
  return Object.keys(params || {}).reduce((res, key) => {
    if (typeof params[key] === "object") {
      params[key] = parseSearchParams(params[key]);
      res[key] = params[key];
    } else if (params[key]) {
      res[key] = params[key];
    }
    return res;
  }, {});
};
