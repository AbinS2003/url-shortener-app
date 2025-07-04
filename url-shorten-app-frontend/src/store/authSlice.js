import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: localStorage.getItem("token")
      ? {
          token: localStorage.getItem("token"),
          email: ''
        }
      : null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {

    setUser: (state,action)=>{
            state.user = action.payload;
            state.isAuthenticated = true; 
    },

    removeUser: (state)=>{
            state.user = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
    },
  },
});

export const {setUser, removeUser} = authSlice.actions
export default authSlice.reducer;