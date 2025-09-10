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
  make: null,
  model: null,
  transmission: "All",
  ecoFriendly: [],
  features: [],
  sortBy: "Relevance",
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
    setMakeModelFilter: (state, action) => {
      state.make = action.payload.make;
      state.model = action.payload.model;
    },
    setTransmissionFilter: (state, action) => {
      state.transmission = action.payload;
    },
    setEcoFriendlyFilter: (state, action) => {
      state.ecoFriendly = action.payload;
    },
    setFeaturesFilter: (state, action) => {
      state.features = action.payload;
    },
    setSortByFilter: (state, action) => {
      state.sortBy = action.payload;
    },
    resetAllFilters: () => initialState,
  },
});

export const {
  setPriceFilter,
  setYearFilter,
  setSeatsFilter,
  setVehicleTypesFilter,
  setMakeModelFilter,
  setTransmissionFilter,
  setEcoFriendlyFilter,
  setFeaturesFilter,
  setSortByFilter,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
