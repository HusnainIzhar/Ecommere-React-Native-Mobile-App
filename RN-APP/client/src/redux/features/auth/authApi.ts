import { apiSlice } from "../api/apiSlice";
import {
  userRegistration,
  userLoggedIn,
  userLoggedOut,
  userOTP,
} from "./authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

type RegistrationResponse = {
  message: string;
  activationToken: string;
};
type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),
    check: builder.mutation({
      query: (data) => ({
        url: "check",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          await AsyncStorage.setItem("accessToken", result.data.accessToken);
          await AsyncStorage.setItem(
            "refreshToken",
            result.meta.response.headers.get("refresh_token")
          );
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
              refreshToken: result.meta.response.headers.get("refresh_token"),
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
              refreshToken: result.meta.response.headers.get("refresh_token"),
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    logout: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    changePassword: builder.mutation({
      query: (body) => ({
        url: "update-password",
        method: "PUT",
        credentials: "include" as const,
        body: body,
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "verify-OTP",
        method: "POST",
        body: { activation_token, activation_code },
        credentials: "include" as const,
      })
    }),
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: "forgot-password",
        method: "PUT",
        credentials: "include" as const,
        body: body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useCheckMutation,
  useSocialAuthMutation,
  useLogoutQuery,
  useChangePasswordMutation,
  useVerifyOTPMutation,
  useForgotPasswordMutation,
} = authApi;
