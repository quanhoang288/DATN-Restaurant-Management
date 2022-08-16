export const errorActionTypes = {
  SET_ERROR: "SET_ERROR",
  RESET: "RESET",
};

const setError = (errInfo) => ({
  type: "SET_ERROR",
  payload: errInfo,
});

const resetError = () => ({
  type: "RESET",
});

export { setError, resetError };
