import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://car-rental-back-hzzg.onrender.com/api/v1/cars/search",
        { params: filters }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState: {
    items: [],
    totalCars: 0,
    totalPages: 0,
    status: "idle",
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.data;
        state.totalCars = action.payload.totalCars;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default carsSlice.reducer;
