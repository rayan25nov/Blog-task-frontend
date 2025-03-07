import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Card from "./Card";
import { Link } from "react-router-dom";
import { selectBlog } from "../Features/BlogSlice";
import Loader from "../loader/Loader"; // Assuming you have a Loader component
import { handleAuthCheck } from "../utils/AuthCheck";

const Blog = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [currentBlogs, setCurrentBlogs] = useState<any[]>([]); // Current page Blogs
  const [totalPages, setTotalPages] = useState<number>(1);
  const JWT_TOKEN = localStorage.getItem("token");

  const blogs = useSelector(selectBlog);

  // Update currentBlogs and totalPages whenever `blogs` changes
  useEffect(() => {
    if (blogs?.length > 0) {
      setTotalPages(Math.ceil(blogs.length / blogsPerPage));
      const startIndex = (currentPage - 1) * blogsPerPage;
      const endIndex = startIndex + blogsPerPage;
      setCurrentBlogs(blogs.slice(startIndex, endIndex));
      setLoading(false); // Data loaded
    } else {
      setLoading(true); // No data, show loader
    }
  }, [blogs, currentPage, blogsPerPage]);

  // Handle pagination
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <hr className="my-4" />
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold">All BLOGS</h1>
      </div>
      <hr className="my-4" />

      <div className="mb-4 flex justify-end">
        <Link
          onClick={(e) => {
        if (!handleAuthCheck(JWT_TOKEN)) e.preventDefault();
          }}
          to="/create-blog"
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Create Blog
        </Link>
      </div>
      <p className="text-lg mb-4">All blogs</p>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentBlogs.map((blog) => (
              <div key={blog._id}>
                <Card
                  title={blog.title}
                  description={blog.description}
                  imageUrl={blog.image}
                  blogId={blog._id}
                />
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Blog;
