import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'


export const store = configureStore({
  middleware: (getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  reducer: {
        user : userReducer
  },
})