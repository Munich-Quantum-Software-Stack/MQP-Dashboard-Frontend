import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import accessibilitiesReducer from './accessibilities-slice';

const store = configureStore({
  reducer: {
    authentication: authReducer,
    accessibilities: accessibilitiesReducer,
  },
});

export default store;
