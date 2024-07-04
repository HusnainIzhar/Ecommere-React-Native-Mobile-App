import { apiSlice } from "../api/apiSlice";
import { setAnalytics, setOrdersAnalytics } from "./analyticsSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    GetOrderAnalytics: builder.query({
      query: () => {
        return {
          url: `get-orders-analytics`,
          method: "GET",
          credentials: "include",
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log("fjdfj", result, "fhdsjh");

          dispatch(setOrdersAnalytics(result.data.data));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    GetAnalytics: builder.query({
      query: () => {
        return {
          url: `analytics`,
          method: "GET",
          credentials: "include",
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(setAnalytics(result.data.data));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useGetAnalyticsQuery, useGetOrderAnalyticsQuery } = analyticsApi;
