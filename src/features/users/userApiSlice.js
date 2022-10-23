import { apiSlice } from "../../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
      keepUnusedDataFor: 5, //5 sec cache refresh
    }),
  }),
});

export const { useGetUsersQuery } = userApiSlice;
