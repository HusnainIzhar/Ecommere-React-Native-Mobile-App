import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateAvatar: builder.mutation({
            query: (data) => ({
                url: `update-avatar`,
                method: "PUT",
                body:data,
                credentials: "include" as const,
            }),
        }),
        updateProfileInfo: builder.mutation({
            query: (data) => ({
                url: `update-profile-info`,
                method: "PUT",
                body:data,
                credentials: "include" as const,
            }),
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: `update-password`,
                method: "PUT",
                body:data,
                credentials: "include" as const,
            }),
        }),
    }),
});

export const {useUpdateAvatarMutation,useUpdateProfileInfoMutation,useChangePasswordMutation} = userApi;