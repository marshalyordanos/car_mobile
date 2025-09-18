import { createSlice } from "@reduxjs/toolkit";

// we will load this from AsyncStorage later
const initialState = {
  ids: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      state.ids.push(action.payload);
    },
    removeFavorite: (state, action) => {
      state.ids = state.ids.filter((id) => id !== action.payload);
    },
  },
});

export const {} = favoritesSlice.actions;

export default favoritesSlice.reducer;
