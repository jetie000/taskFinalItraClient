import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { variables } from "../../variables";

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: fetchBaseQuery({
      baseUrl: variables.API_URL,
      prepareHeaders: (headers) => {
        const token = variables.ACCESS_TOKEN;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
      },
    }),
    tagTypes: ["Collections", "User", "Collection"],
    endpoints: () => ({}),
  });