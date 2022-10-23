import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials, logout } from "../../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3500",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState.auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    }
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.originalStatus === 403) {
    console.log("Sending refersh token");
    // send referesh token to get new access token
    const refershResult = await baseQuery("/referesh", api, extraOptions);
    if (refershResult?.data) {
      const user = api.getState().auth.user;
      //store new token
      api.dispatch(setCredentials({ ...refershResult.data, user }));
      //retry the orignal query with new acess token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
