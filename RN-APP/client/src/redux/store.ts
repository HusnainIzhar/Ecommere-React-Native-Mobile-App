import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./features/api/apiSlice";
import authSlice from "./features/auth/authSlice";
import productSlice from "./features/product/productSlice";
import analyticsSlice from "./features/analytics/analyticsSlice";
import orderSlice from "./features/orders/orderSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice,
    allProducts: productSlice,
    analytics: analyticsSlice,
    orders: orderSlice,
  },
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware as any),
});

export const initializeApp = async () => {
  await store.dispatch(
    apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
};

if (require.main === module) {
  initializeApp();
}
export type RootState = ReturnType<typeof store.getState>;
