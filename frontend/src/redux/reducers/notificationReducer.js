import { notificationAction } from '../actions'

const initialState = {
  numNewNotifications: 0,
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case notificationAction.notificationActionTypes.NEW_NOTIFICATION: {
      return { numNewNotifications: state.numNewNotifications + 1 }
    }

    case notificationAction.notificationActionTypes.READ_ALL:
      return { numNewNotifications: 0 }

    default:
      return state
  }
}

export default notificationReducer

