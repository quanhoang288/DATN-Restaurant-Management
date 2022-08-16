import { errorActions } from "../actions";

const initialState = {
  error: null,
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case errorActions.errorActionTypes.SET_ERROR: {
      return {
        error: action.payload,
      };
    }

    case errorActions.errorActionTypes.RESET: {
      return initialState;
    }

    default:
      return state;
  }
};

export default errorReducer;
