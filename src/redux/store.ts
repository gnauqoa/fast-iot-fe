import { configureStore } from '@reduxjs/toolkit';
import statusReducer from './slices/statusSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    status: statusReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
