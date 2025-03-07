import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Params {
  postId?: string;
}

const UpdateBlog = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [readImg, setReadImg] = useState<string | ArrayBuffer | null>(null);

  const { postId } = useParams() as Params;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const url = `${apiUrl}/posts/${postId}`;
      const JWT_TOKEN = localStorage.getItem("token");

      const { data: res } = await axios.put(url, formData, {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      });
      console.log(res);
      setTitle("");
      setDescription("");
      setImage(null);
      setReadImg(null);
    } catch (error: any) {
      console.log(error);
      toast.error(`${error.response.data.message}`, {
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
      setReadImg(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
      setImage(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Update Post</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id" className="block text-sm font-medium text-gray-700">_id</label>
          <input type="text" id="id" value={postId} disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
        </div>
        <div className="form-group">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          <div className="mt-1">
            {readImg ? (
              <img
                src={readImg as string}
                alt="Uploaded"
                className="w-full h-auto rounded-md"
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
          <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Submit
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateBlog;
