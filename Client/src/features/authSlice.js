import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
    user: storedUser ? JSON.parse(storedUser) : null,
    token: storedToken || null,
    isAuthenticated: !!storedToken,
};

const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        userLoggedIn: (state, action) => {
            const { user, token } = action.payload;

            if (user) {
                state.user = user;
                localStorage.setItem("user", JSON.stringify(user));
            }

            if (token) {
                state.token = token;
                localStorage.setItem("token", token);
            }
            
            state.isAuthenticated = true;
        },

        userLoggedOut: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        },
    },
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;
