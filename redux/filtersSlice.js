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
  mileage: {
    min: 0,
    max: 1000,
  },
  seats: "All seats",
  brands: [],
  models: [],
  transmission: "All",
  ecoFriendly: [],
  features: [],
  sortBy: "Relevance",
  closeSignal: 0,
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
    setBrandsFilter: (state, action) => {
      state.brands = action.payload;
    },
    setModelsFilter: (state, action) => {
      state.models = action.payload;
    },
    setTransmissionFilter: (state, action) => {
      state.transmission = action.payload;
    },
    setEcoFriendlyFilter: (state, action) => {
      state.ecoFriendly = action.payload;
    },
    setMileageFilter: (state, action) => {
      state.mileage = action.payload;
    },
    setFeaturesFilter: (state, action) => {
      state.features = action.payload;
    },
    setSortByFilter: (state, action) => {
      state.sortBy = action.payload;
    },
    triggerCloseSignal: (state) => {
      state.closeSignal += 1;
    },
    resetMakeModelFilter: (state) => {
      state.brands = [];
      state.models = [];
    },
    resetAllFilters: () => initialState,
  },
});

export const {
  setPriceFilter,
  setYearFilter,
  setSeatsFilter,
  setVehicleTypesFilter,
  setBrandsFilter,
  setModelsFilter,
  setTransmissionFilter,
  setEcoFriendlyFilter,
  setMileageFilter,
  setFeaturesFilter,
  setSortByFilter,
  triggerCloseSignal,
  resetMakeModelFilter,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
