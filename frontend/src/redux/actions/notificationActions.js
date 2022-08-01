export const notificationActionTypes = {
  NEW_NOTIFICATION: 'NEW_NOTIFICATION',
  READ_ALL: 'READ_ALL',
}

const addNewNotifications = () => ({
  type: 'NEW_NOTIFICATION',
})

const readAllNotifications = () => ({
  type: 'READ_ALL',
})

export { addNewNotifications, readAllNotifications }

