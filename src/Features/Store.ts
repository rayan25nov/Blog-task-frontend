// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import BlogReducer from "./BlogSlice";

const store = configureStore({
  reducer: {
    blog: BlogReducer,
  },
});

export default store;
