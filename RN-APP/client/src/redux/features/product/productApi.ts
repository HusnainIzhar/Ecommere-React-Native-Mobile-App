import { apiSlice } from "../api/apiSlice";
import { setProducts } from "./productSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    AddProduct: builder.mutation({
      query: (data) => ({
        url: `add-product`,
        method: "POST",
        body: data.form,
        credentials: "include",
      }),
    }),
    GetAllProducts: builder.query({
      query: () => ({
        url: `products`,
        method: "GET",
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          dispatch(setProducts(result.data.products));
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    DeleteProduct: builder.mutation({
      query: (data) => ({
        url: `delete-product/${data.id}`,
        method: "DELETE",
        credentials: "include"
      }),
    }),
    UpdateProduct: builder.mutation({
      query: (data) => {
        return {
          url: `edit-product/${data.id}`,
          method: "PUT",
          credentials: "include",
          body: data.form,
        };
      },
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
