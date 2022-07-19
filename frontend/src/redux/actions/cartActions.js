export const cartActionTypes = {
  ADD: 'add',
  REMOVE: 'remove',
  UPDATE: 'update',
}

const addToCart = (itemId) => ({
  type: cartActionTypes.ADD,
  payload: itemId,
})

const removeFromCart = (itemId) => ({
  type: cartActionTypes.REMOVE,
  payload: itemId,
})

const updateCart = (itemId, quantity) => ({
  type: cartActionTypes.UPDATE,
  payload: {
    itemId,
    quantity,
  },
})

export { addToCart, removeFromCart, updateCart }

