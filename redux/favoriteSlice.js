import { createSlice } from "@reduxjs/toolkit";

export const favoriteSlice = createSlice({
  name: "favorite",
  initialState: {
    favorites: [],
  },
  reducers: {
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    addFavorite: (state, action) => {
      state.favorites = [action.payload, ...state.favorites];
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (car) => car?._id !== action.payload
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFavorites, addFavorite, removeFavorite } =
  favoriteSlice.actions;

export default favoriteSlice.reducer;
export const selectFavorites = (state) => state.favorite.favorites;
