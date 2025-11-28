/**
 * auth-slice.js - Redux slice for managing user authentication state and session tokens
 */

import { createSlice } from '@reduxjs/toolkit';

// Initial auth state with forced password reset flag, token, and session expiration status
const initialAuthState = {
  isForcedReset: true,
  access_token: null,
  isExpired: false,
};

// Redux slice with reducers to handle login, logout, password reset flow, and token expiration
const authSlice = createSlice({
  name: 'authentication',
  initialState: initialAuthState,
  reducers: {
    // Store access token in state and localStorage on successful login
    logged_in(state, action) {
      state.isExpired = false;
      state.access_token = action.payload.access_token;
      localStorage.setItem('token', action.payload.access_token);
    },
    // Clear all auth data from state and localStorage on logout
    logout(state) {
      state.access_token = null;
      state.isExpired = true;

      localStorage.removeItem('token');
      localStorage.removeItem('isReset');
      localStorage.removeItem('expiration');
    },
    enable_reset(state) {
      state.isForcedReset = true;
      localStorage.setItem('isReset', state.isForcedReset);
    },
    disable_reset(state) {
      state.isForcedReset = false;
      localStorage.setItem('isReset', state.isForcedReset);
    },
    // Mark session as expired and clear token data from localStorage
    set_expired(state) {
      state.isExpired = true;
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
