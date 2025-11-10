import { createSlice } from "@reduxjs/toolkit";
import { getDarkmode, getFontsize } from "src/components/utils/theme";

const initialAccessibilitiesState = {
    darkmode: getDarkmode(),
    font_size: getFontsize(),
};

const AccessibilitiesSlice = createSlice({
    name: "accessibilities",
    initialState: initialAccessibilitiesState,
    reducers: {
        toggleDarkmode(state, action) {
            state.darkmode = action.payload;
            localStorage.setItem("darkmode", state.darkmode);
        },
        toggleFontsize(state, action) {
            state.font_size = action.payload;
            localStorage.setItem("font-size", state.font_size);
        }
    },
});


export const accessibilitiesAction = AccessibilitiesSlice.actions;
export default AccessibilitiesSlice.reducer;
