/**
 * accessibilities-slice.js - Redux slice for managing UI accessibility preferences (darkmode, font size)
 */

import { createSlice } from '@reduxjs/toolkit';
import { getDarkmode, getFontsize } from '@utils/theme';

// Initialize state with persisted preferences from localStorage via theme utils
const initialAccessibilitiesState = {
  darkmode: getDarkmode(),
  font_size: getFontsize(),
};

// Redux slice with reducers to toggle accessibility settings and persist to localStorage
const AccessibilitiesSlice = createSlice({
  name: 'accessibilities',
  initialState: initialAccessibilitiesState,
  reducers: {
    toggleDarkmode(state, action) {
      state.darkmode = action.payload;
      localStorage.setItem('darkmode', state.darkmode);
    },
    toggleFontsize(state, action) {
      state.font_size = action.payload;
      localStorage.setItem('font-size', state.font_size);
    },
  },
});

export const accessibilitiesAction = AccessibilitiesSlice.actions;
export default AccessibilitiesSlice.reducer;
