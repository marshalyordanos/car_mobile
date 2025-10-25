// ../redux/bookingSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = 'https://car-back-22tv.onrender.com/'; 

export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/bookings/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState: {
    booking: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearBooking: (state) => {
      state.booking = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.booking = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;