import { apiSlice } from "../api/apiSlice";

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    AddReview: builder.mutation({
      query: (data) => {
        return {
          url: `add-review`,
          method: "POST",
          credentials: "include",
          body: data.data,
        };
      },
    }),
  }),
});

export const { useAddReviewMutation } = reviewsApi;
