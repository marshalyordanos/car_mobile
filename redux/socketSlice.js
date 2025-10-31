import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SocketService from "../socket";

const initialState = {
  connected: false,
  userId: null,
};

export const connectSocket = createAsyncThunk(
  "socket/connectSocket",
  async (userId, { dispatch }) => {
    if (!userId) {
      console.log("⚠️ No user ID provided for socket connection");
      return;
    }

    console.log("🔌 Connecting socket for user:", userId);

    SocketService.connect(
      userId,
      () => dispatch(setConnected(true)),
      () => dispatch(setConnected(false))
    );
  }
);

export const disconnectSocket = createAsyncThunk(
  "socket/disconnectSocket",
  async (_, { dispatch }) => {
    SocketService.disconnect();
    dispatch(setConnected(false));
  }
);

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setConnected: (state, action) => {
      state.connected = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const { setConnected, setUserId } = socketSlice.actions;
export default socketSlice.reducer;
