import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  price: {
    min: 10,
    max: 500,
  },
  vehicleTypes: [],
  years: {
    min: 1952,
    max: new Date().getFullYear(),
  },
  seats: "All seats",
  // We will add more filters here later (years, seats, etc.)
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setPriceFilter: (state, action) => {
      state.price.min = action.payload.min;
      state.price.max = action.payload.max;
    },
    setVehicleTypesFilter: (state, action) => {
      state.vehicleTypes = action.payload;
    },
    setYearFilter: (state, action) => {
      state.years.min = action.payload.min;
      state.years.max = action.payload.max;
    },
    setSeatsFilter: (state, action) => {
      state.seats = action.payload;
    },
    resetAllFilters: () => initialState,
  },
});

export const {
  setPriceFilter,
  setVehicleTypesFilter,
  setYearFilter,
  setSeatsFilter,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
