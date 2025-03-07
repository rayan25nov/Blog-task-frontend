import { createSlice } from "@reduxjs/toolkit";

interface BlogPost {
  _id: string;
  title: string;
  description: string;
  image: string;
  userId: string;
}

const blogSlice = createSlice({
  name: "blog",
  initialState: [] as BlogPost[],
  reducers: {
    setBlogs: (_, action) => action.payload,
    deleteBlog: (state, action) =>
      state.filter((post) => post._id !== action.payload),
  },
});

export const { setBlogs, deleteBlog } = blogSlice.actions;
export const selectBlog = (state: { blog: BlogPost[] }) => state.blog;
export default blogSlice.reducer;
