import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api";

export const fetchBrands = createAsyncThunk(
  "filterOptions/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/car-makes");
      console.log("normalized:1 ", response.data);
      return response.data.data; // each brand includes models
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const filterOptionsSlice = createSlice({
  name: "filterOptions",
  initialState: {
    brandsWithModels: {
      brands: [],
      status: "idle",
      error: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state) => {
        state.brandsWithModels.status = "loading";
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brandsWithModels.status = "succeeded";
        state.brandsWithModels.brands = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        state.brandsWithModels.status = "failed";
        state.brandsWithModels.error = action.payload;
      });
  },
});

export default filterOptionsSlice.reducer;
