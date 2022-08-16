import { cartActions } from "../actions";

const initialState = {
  items: [],
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case cartActions.cartActionTypes.ADD: {
      const itemIdx = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      return itemIdx !== -1
        ? {
            items: state.items.map((item, idx) =>
              idx === itemIdx ? { ...item, quantity: item.quantity + 1 } : item
            ),
          }
        : {
            items: [...state.items, { ...(action.payload || {}), quantity: 1 }],
          };
    }

    case cartActions.cartActionTypes.REMOVE:
      return {
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case cartActions.cartActionTypes.UPDATE: {
      const { itemId, quantity } = action.payload;
      return {
        items: quantity
          ? state.items.map((item) =>
              item.id === itemId ? { ...item, quantity: quantity } : item
            )
          : state.items.filter((item) => item.id !== itemId),
      };
    }

    case cartActions.cartActionTypes.RESET: {
      return { items: [] };
    }

    default:
      return state;
  }
};

export default cartReducer;
