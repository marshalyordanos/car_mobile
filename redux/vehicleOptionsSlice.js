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

const vehicleOptionsSlice = createSlice({
  name: "filterOptions",
  initialState: {
    vehicleTypes: {
      items: [],
      status: "idle",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicleTypes.pending, (state) => {
        state.vehicleTypes.status = "loading";
      })
      .addCase(fetchVehicleTypes.fulfilled, (state, action) => {
        state.vehicleTypes.status = "succeeded";
        state.vehicleTypes.items = action.payload;
      })
      .addCase(fetchVehicleTypes.rejected, (state) => {
        state.vehicleTypes.status = "failed";
      });
  },
});

export default vehicleOptionsSlice.reducer;
