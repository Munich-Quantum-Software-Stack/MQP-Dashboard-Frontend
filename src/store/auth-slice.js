import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
    isForcedReset: true,
    access_token: null,
    isExpired: false
};
const authSlice = createSlice({
    name: "authentication",
    initialState: initialAuthState,
    reducers: {
        logged_in(state, action) {
            state.isExpired = false;
            state.access_token = action.payload.access_token;
            localStorage.setItem("token", action.payload.access_token);
        },
        logout(state) {
            state.access_token = null;
            state.isExpired = true;
            
            localStorage.removeItem("token");
            localStorage.removeItem("isReset");
            localStorage.removeItem("expiration");
        },
        enable_reset(state) {
            state.isForcedReset = true;
            localStorage.setItem("isReset", state.isForcedReset);
        },
        disable_reset(state) {
            state.isForcedReset = false;
            localStorage.setItem("isReset", state.isForcedReset);
        },
        set_expired(state) {
            state.isExpired = true;
            localStorage.removeItem("token");
            localStorage.removeItem("expiration");
        }
    },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
