import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api";

export const fetchBrands = createAsyncThunk(
  "filterOptions/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/car-makes");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchModels = createAsyncThunk(
  "filterOptions/fetchModels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/car-models");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const filterOptionsSlice = createSlice({
  name: "filterOptions",
  initialState: {
    brands: {
      items: [],
      status: "idle",
    },
    models: {
      items: [],
      status: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers for Brands
      .addCase(fetchBrands.pending, (state) => {
        state.brands.status = "loading";
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands.status = "succeeded";
        state.brands.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state) => {
        state.brands.status = "failed";
      })
      // Reducers for Models
      .addCase(fetchModels.pending, (state) => {
        state.models.status = "loading";
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.models.status = "succeeded";
        state.models.items = action.payload;
      })
      .addCase(fetchModels.rejected, (state) => {
        state.models.status = "failed";
      });
  },
});

export default filterOptionsSlice.reducer;
