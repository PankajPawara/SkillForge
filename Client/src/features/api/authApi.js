import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/`;

export const authApi = createApi({

    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: USER_API,
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth?.token || localStorage.getItem("token");
            console.log("token from baseQuery:", token);

            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
        credentials: "include",
    }),


    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData,
            }),
        }),

        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "login",
                method: "POST",
                body: credentials,
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;

                    const token = result?.data?.token;
                    const user = result?.data?.user;

                    if (!token) console.error("TOKEN NOT FOUND IN LOGIN RESPONSE");

                    localStorage.setItem("token", token);
                    localStorage.setItem("user", JSON.stringify(user));

                    dispatch(userLoggedIn({ user, token }));

                } catch (err) {
                    console.log("Login Error:", err);
                }
            },
        }),

        logoutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET",
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    await queryFulfilled;
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            },
        }),

        loadUser: builder.query({
            query: () => "profile",
            async onQueryStarted(_, { queryFulfilled, dispatch, getState }) {
                try {
                    const result = await queryFulfilled;

                    const user = result?.data?.user;

                    // get existing token
                    const token = await getState().auth.token || await localStorage.getItem("token");

                    console.log("token from loadUser:", token);

                    localStorage.setItem("user", JSON.stringify(user));

                    // IMPORTANT: ALWAYS pass token
                    dispatch(userLoggedIn({ user, token }));

                } catch (error) {
                    console.log("loadUser error:", error);

                    if (error?.error?.status === 401) {
                        dispatch(userLoggedOut());
                    }
                }
            },
        }),

        updateUser: builder.mutation({
            query: (formData) => ({
                url: "profile/update",
                method: "PUT",
                body: formData,
                credentials: "include",
            }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
} = authApi;
