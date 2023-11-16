import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as userReducer } from './user/user.slice'
import { reducer as toastReducer } from './toast/toast.slice'
import { userApi } from './api/user.api'

const reducers = combineReducers({
  user: userReducer,
  toast: toastReducer,
  [userApi.reducerPath]: userApi.reducer,
})

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch