import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// export const login = createAsyncThunk(
//   "auth/login",
//   async ({username,password}, { rejectWithValue }) => {
//     try {

//       const res = await api.post("/api/authenticate",{
//         username: "user",
//         password: "user",
//         rememberMe: true
//       });

//       // localStorage.setItem("user", JSON.stringify(res.data));

//       console.log(res)
//       return res;
//     } catch (err) {
//       return rejectWithValue(err.response.data);
//     }
//   }
// );

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "false33",
    user: null,
    map: "new",
    lan: "am",
    farmer_id: null,
    cancellationPolicies: [],
  },
  reducers: {
    setCredential: (state, action) => {
      const { user } = action.payload;
      state.user = user;
    },
    setcancellationPolicies: (state, action) => {
      state.cancellationPolicies = action.payload;
    },
    login: (state, action) => {
      // console.log(action.payload);

      state.user = action.payload;
    },
    logout: (state, action) => {
      state.user = null;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    saveMap: (state, action) => {
      // console.log(action.payload);

      state.map = action.payload;
    },
    deleteMap: (state, action) => {
      state.map = "";
    },
    setId: (state, action) => {
      console.log("farmer_id", action.payload);
      state.farmer_id = action.payload;
    },
    changeLanguageHandler: (state, action) => {
      state.lan = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setCredential,
  logout,
  incrementByAmount,
  deleteMap,
  login,
  saveMap,
  setId,
  changeLanguageHandler,
  setcancellationPolicies,
} = authSlice.actions;

export default authSlice.reducer;
export const selectCurrentUser = (state) => state.auth.user;
export const selectCancellationPolicies = (state) =>
  state.auth.cancellationPolicies;

export const selectMap = (state) => state.auth.map;
export const selectFarmerId = (state) => state.auth.farmer_id;
