import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  chatList: [],
  messages: null,
  notifications: [],
  notificationCount: 0,
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
    setNotification: (state, action) => {
      state.notifications = [...action.payload];
    },
    appendNotifications: (state, action) => {
      state.notifications = [...state.notifications, ...action.payload];
    },
    addOneToNotification: (state, action) => {
      state.notificationCount += 1;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});

export const {
  appendChatList,
  reOrderChatList,
  setChatList,
  setNotification,
  appendNotifications,
  addOneToNotification,
  setNotificationCount,
} = chatSlice.actions;
export default chatSlice.reducer;

export const selectChatList = (state) => state.chat.chatList;
export const selectMessages = (state) => state.chat.messages;
export const selectNotificationCount = (state) => state.chat.notificationCount;
export const selectNotifications = (state) => state.chat.notifications;
