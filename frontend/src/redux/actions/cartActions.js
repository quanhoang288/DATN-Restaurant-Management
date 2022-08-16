export const cartActionTypes = {
  ADD: "add",
  REMOVE: "remove",
  UPDATE: "update",
  RESET: "reset",
};

const addToCart = (item) => ({
  type: cartActionTypes.ADD,
  payload: item,
});

const removeFromCart = (itemId) => ({
  type: cartActionTypes.REMOVE,
  payload: itemId,
});

const updateCart = (itemId, quantity) => ({
  type: cartActionTypes.UPDATE,
  payload: {
    itemId,
    quantity,
  },
});

const resetCart = () => ({ type: cartActionTypes.RESET });

export { addToCart, removeFromCart, updateCart, resetCart };
