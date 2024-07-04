import { apiSlice } from "../api/apiSlice";
import { setOrders } from "./orderSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    AddOrder: builder.mutation({
      query: (body) => {
        return {
          url: `add-order`,
          method: "POST",
          credentials: "include",
          body: body.data,
        };
      },
    }),
    ManageOrder: builder.mutation({
      query: (body) => {
        return {
          url: `manage-order`,
          method: "POST",
          credentials: "include",
          body: {
            product: body.product,
            status: body.status,
            orderId: body.orderId,
          },
        };
      },
    }),
    getOrders: builder.query({
      query: () => {
        return {
          url: "orders",
          credentials: "include",
          method: "GET",
        };
      },
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(setOrders(result.data.orders));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useAddOrderMutation,
  useGetOrdersQuery,
  useManageOrderMutation,
} = ordersApi;
