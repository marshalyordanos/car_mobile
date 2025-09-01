import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import images from "../constants/images";
const cars_mock = [
  { id: 1, name: "Model S", price: 79999, brand: "Tesla", image: images.car1 },
  { id: 2, name: "Civic", price: 22000, brand: "Honda", image: images.car2 },
  { id: 3, name: "Mustang", price: 35000, brand: "Ford", image: images.car3 },
  { id: 4, name: "Corolla", price: 19000, brand: "Toyota", image: images.van1 },
  { id: 5, name: "A4", price: 40000, brand: "Audi", image: images.car1 },
  { id: 6, name: "Camry", price: 24000, brand: "Toyota", image: images.car2 },
];
export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async (filters, { rejectWithValue }) => {
    console.log(" mock car data ");
    return {
      success: true,
      page: 1,
      totalPages: 1,
      totalCars: 6,
      data: cars_mock,
    };
    // try {
    //   const response = await axios.get(
    //     "https://car-rental-back-hzzg.onrender.com/api/v1/cars",
    //     { params: filters }
    //   );
    //   return response.data;
    // } catch (error) {
    //   return rejectWithValue(error.response.data);
    // }
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
