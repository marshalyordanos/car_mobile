import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  messages: null,
};

const chatSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setChatList: (state, action) => {
      state.chatList = [...action.payload];
    },
    appendChatList: (state, action) => {
      state.chatList = [...state.chatList, ...action.payload];
    },
    reOrderChatList: (state, action) => {
      console.log("bb: ", action.payload);
      const bookingId = action.payload?.bookingId;

      const restList = state.chatList.filter(
        (list) => list?.bookingId !== bookingId
      );
      state.chatList = [action.payload, ...restList];
    },
    reOrderChatListById: (state, action) => {
      const bookingId = action.payload;

      const currentList = state.chatList.find(
        (list) => list?.bookingId == bookingId
      );
      const restList = state.chatList.filter(
        (list) => list?.bookingId !== bookingId
      );
      state.chatList = [
        { ...currentList, unreadCount: currentList?.unreadCount + 1 },
        ...restList,
      ];
    },
  },
});

export const { appendChatList, reOrderChatList, setChatList } =
  chatSlice.actions;
export default chatSlice.reducer;

export const selectChatList = (state) => state.chat.chatList;
export const selectMessages = (state) => state.chat.messages;
