import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const categorySlice = createSlice({
  name: "main_category",
  initialState: {
    main_categories: [],
    err: null,
    status: "",
  },
  reducers: {
    getMainCategories: (state, action) => {
      state.main_categories = action.payload;
    },
  },
});

export const { getMainCategories } = categorySlice.actions;

export default categorySlice.reducer;
export const selectCategory = (state) => state.main_category.main_categories;
