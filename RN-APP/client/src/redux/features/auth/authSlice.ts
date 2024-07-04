import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: string;
  accessToken: string;
  refreshToken: string;
  otp: string;
}

const initialState: AuthState = {
  user: "",
  accessToken: "",
  refreshToken: "",
  otp: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.accessToken = action.payload.token;
    },
    userOTP: (state, action: PayloadAction<{ otp: string }>) => {
      state.otp = action.payload.otp;
    },
    userLoggedIn: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: string;
      }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.user = "";
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut, userOTP } =
  authSlice.actions;
export default authSlice.reducer;
