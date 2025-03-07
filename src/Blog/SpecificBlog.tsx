import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectBlog, deleteBlog } from "../Features/BlogSlice";
import { toast } from "react-toastify";
import { handleAuthCheck, AuthUser } from "../utils/AuthCheck";
import axios from "axios";
import Loader from "../loader/Loader";

interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
}

const SpecificBlog: React.FC = () => {
  const blogs = useSelector(selectBlog) as Blog[];
  const { blogId } = useParams<{ blogId: string }>();
  const navigate = useNavigate();
  const JWT_TOKEN = localStorage.getItem("token");
  const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const blog = blogs?.find((blog) => blog._id === blogId);

  const deleteBlogPost = async () => {
    if (!handleAuthCheck(JWT_TOKEN)) return;
    setLoading(true);
    try {
      const url = `${apiUrl}/blogs/${blogId}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      });
      dispatch(deleteBlog(blogId));
      toast.success("Blog deleted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "You're not Authorized to delete this blog",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      console.error("Error deleting blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateClick = async () => {
    if (!handleAuthCheck(JWT_TOKEN)) return;
    if (!blogId) {
      toast.error("Blog ID is missing.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    const isAuthorized = await AuthUser(blogId, apiUrl);

    if (!isAuthorized) {
      toast.error("You are not authorized to update this blog.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    navigate(`/update-blog/${blogId}`);
  };

  useEffect(() => {
    if (!blogs) {
      navigate("/");
    }
  }, [blogs, navigate]);

  if (!blog) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="flex flex-col items-center justify-center">
          <p className="text-lg font-semibold mb-4">Deleting Blog...</p>
          <Loader />
        </div>
      )}
      {!loading && (
        <>
            <div className="flex justify-between items-center mb-4 w-full max-w-md mx-auto">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleUpdateClick}
            >
              Update Blog
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={deleteBlogPost}
            >
              Delete Blog
            </button>
            </div>
          <h1 className="text-3xl font-bold my-4">{blog.title}</h1>
          <img
            src={blog.image}
            alt="Blog"
            className="w-full h-auto max-w-2xl mx-auto rounded-lg mb-4 object-cover"
          />
          <p className="text-lg mb-4">{blog.description}</p>
        </>
      )}
    </div>
  );
};

export default SpecificBlog;
