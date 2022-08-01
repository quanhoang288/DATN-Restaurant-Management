import { combineReducers, createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authReducer, cartReducer, modalReducer, notificationReducer } from './reducers'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user'],
}

const cartPersistConfig = {
  key: 'cart',
  storage,
}

const notificationPersistConfig = {
  key: 'notification',
  storage,
}

const reducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  modal: modalReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  notification: persistReducer(notificationPersistConfig, notificationReducer),
})

export const store = createStore(reducer)
export const persistor = persistStore(store)

