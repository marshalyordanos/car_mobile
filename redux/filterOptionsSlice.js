import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchVehicleTypes = createAsyncThunk(
  "filterOptions/fetchVehicleTypes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://car-rental-back-hzzg.onrender.com/api/v1/cars/vehicle-types"
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBrands = createAsyncThunk(
  "filterOptions/fetchBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://car-rental-back-hzzg.onrender.com/api/v1/cars/brands"
      );
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
      const response = await axios.get(
        "https://car-rental-back-hzzg.onrender.com/api/v1/cars/models"
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFeatures = createAsyncThunk(
  "filterOptions/fetchFeatures",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://car-rental-back-hzzg.onrender.com/api/v1/cars/features"
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const filterOptionsSlice = createSlice({
  name: "filterOptions",
  initialState: {
    vehicleTypes: {
      items: [],
      status: "idle",
    },
    brands: {
      items: [],
      status: "idle",
    },
    models: {
      items: [],
      status: "idle",
    },
    features: {
      items: [],
      status: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Reducers for Vehicle Types
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.vehicleTypes.status = "loading";
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.vehicleTypes.status = "succeeded";
        state.vehicleTypes.items = action.payload;
      })
      .addCase(fetchVehicleTypes.rejected, (state) => {
        state.vehicleTypes.status = "failed";
      })
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
      })
      // Reducers for features
      .addCase(fetchFeatures.pending, (state) => {
        state.features.status = "loading";
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.features.status = "succeeded";
        state.features.items = action.payload;
      })
      .addCase(fetchFeatures.rejected, (state) => {
        state.features.status = "failed";
      });
  },
});

export default filterOptionsSlice.reducer;
