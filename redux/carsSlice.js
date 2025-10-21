import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api";

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.get("cars", { params: filters });
      return response.data;
    } catch (error) {
      console.error("API call failed:", error.response?.data || error.message);
      return rejectWithValue(error.response.data);
    }
  }
);

const carsSlice = createSlice({
  name: "cars",
  initialState: {
    items: [],
    pagination: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    },
    canLoadMore: true,
    status: "idle",
    error: null,
  },
  reducers: {
    clearCars: (state) => {
      state.items = [];
      state.pagination.page = 1;
      state.status = "idle";
      state.canLoadMore = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state, action) => {
        const isFirstPage =
          action.meta.arg?.page === 1 || !action.meta.arg?.page;
        state.status = isFirstPage ? "loading" : "loadingMore";
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { data, pagination } = action.payload;
        if (pagination.page === 1) {
          state.items = data;
        } else {
          state.items = [...state.items, ...data];
        }
        state.pagination = pagination;
        state.canLoadMore = pagination.page < pagination.totalPages;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearCars } = carsSlice.actions;
export default carsSlice.reducer;
