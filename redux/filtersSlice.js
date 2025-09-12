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
  brands: [],
  models: null,
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
    setFeaturesFilter: (state, action) => {
      state.features = action.payload;
    },
    setSortByFilter: (state, action) => {
      state.sortBy = action.payload;
    },
    resetAllFilters: (state) => {
      return state.initialState;
    },
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
  setFeaturesFilter,
  setSortByFilter,
  resetAllFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
