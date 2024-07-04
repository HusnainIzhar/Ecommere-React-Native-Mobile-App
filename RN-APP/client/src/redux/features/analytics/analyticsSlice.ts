import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalyticsState {
  analytics: any[];
  ordersAnalytics: any[];
}

const initialState: AnalyticsState = {
  analytics: [],
  ordersAnalytics: [],
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setAnalytics: (state, action: PayloadAction<any[]>) => {
      state.analytics = action.payload;
    },
    setOrdersAnalytics: (state, action: PayloadAction<any[]>) => {
      state.ordersAnalytics = action.payload;
    },
  },
});

export const { setAnalytics, setOrdersAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;
