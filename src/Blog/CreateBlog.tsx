import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../loader/Loader";
import { setBlogs, selectBlog } from "../Features/BlogSlice";

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [readImg, setReadImg] = useState<string | null>(null);
  const navigate = useNavigate();
  const blogs = useSelector(selectBlog);
  const dispatch = useDispatch();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) formData.append("image", image);

      const createdAt = new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
      formData.append("createdAt", createdAt);

      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const url = `${apiUrl}/blogs`;
      const JWT_TOKEN = localStorage.getItem("token");

      const { data: res } = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      });

      setTitle("");
      setDescription("");
      setImage(null);
      setReadImg(null);

      toast.success("Blog created successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      dispatch(setBlogs([res.newBlog, ...blogs]));
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Error creating blog", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTitle("");
      setDescription("");
      setImage(null);
      setReadImg(null);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setReadImg(reader.result as string);
    };
    reader.readAsDataURL(file as Blob);
    if (file) setImage(file);
  };

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold mb-2">Creating Blog...</p>
          <Loader />
        </div>
      )}
      {!loading && (
        <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
          <h1 className="text-3xl font-bold mb-6">Create Blog</h1>
          <div className="form-group">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              required
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="form-group">
            <label
              htmlFor="image"
              className="block text-sm font-medium text-gray-700"
            >
              Image
            </label>
            <div className="mt-1">
              {readImg ? (
                <img
                  src={readImg}
                  alt="Uploaded image"
                  className="w-full h-auto max-h-64 object-cover rounded-md"
                />
              ) : (
                <p className="text-gray-500">No image uploaded</p>
              )}
            </div>
            <input
              type="file"
              id="image"
              required
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </div>
        </form>
      )}
      <ToastContainer />
    </div>
  );
};

export default CreateBlog;
