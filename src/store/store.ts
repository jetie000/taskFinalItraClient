import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { reducer as userReducer } from './slices/user.slice'
import { reducer as toastReducer } from './slices/toast.slice'
import { reducer as optionsReducer } from './slices/pageOptions.slice'
import { userApi } from './api/user.api'
import { collectionsApi } from './api/collections.api'

const reducers = combineReducers({
  user: userReducer,
  toast: toastReducer,
  options: optionsReducer,
  [userApi.reducerPath]: userApi.reducer,
  [collectionsApi.reducerPath]: collectionsApi.reducer
})

export const store = configureStore({
  reducer: reducers,
  devTools: process.env.NODE_ENV === 'development',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware).concat(collectionsApi.middleware)

})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch