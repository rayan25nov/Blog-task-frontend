import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setBlogs, selectBlog } from "./Features/BlogSlice.ts";
import axios from "axios";
import Navbar from "./navbar/Navbar.tsx";
import Login from "./Auth/Login.tsx";
import Signup from "./Auth/Signup.tsx";
import Blog from "./Blog/Blog.tsx";
import CreateBlog from "./Blog/CreateBlog.tsx";
import SpecificBlog from "./Blog/SpecificBlog.tsx";
import UpdateBlog from "./Blog/UpdateBlog.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const JWT_TOKEN = localStorage.getItem("token");
  const dispatch = useDispatch();
  const blogs = useSelector(selectBlog); // Access blogs from Redux state
  const [shouldFetchBlogs, setShouldFetchBlogs] = useState(true); // Track if blogs need to be fetched

  const fetchAllBlogs = async () => {
    const apiUrl =
      import.meta.env.VITE_REACT_APP_API_URL ||
      "https://blog-task-backend.vercel.app";
    try {
      const { data: res } = await axios.get(`${apiUrl}/blogs`);
      if (JSON.stringify(blogs) !== JSON.stringify(res.blogs)) {
        // Update blogs only if they have changed
        dispatch(setBlogs(res.blogs));
        setShouldFetchBlogs(false); // Mark fetch as done
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  useEffect(() => {
    if (shouldFetchBlogs) fetchAllBlogs();
  }, [shouldFetchBlogs]);

  return (
    <Router>
      <div className="App bg-gray-100 min-h-screen">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Blog />} />
            <Route path="/specific-blog/:blogId" element={<SpecificBlog />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            {/* Protected Routes */}
            {JWT_TOKEN ? (
              <>
                <Route path="/create-blog" element={<CreateBlog />} />
                <Route path="/update-blog/:blogId" element={<UpdateBlog />} />
              </>
            ) : (
              <Route path="*" element={<Navigate replace to="/login" />} />
            )}
          </Routes>
        </div>
        <ToastContainer />
      </div>
    </Router>
  );
};

export default App;
