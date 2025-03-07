import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader.tsx";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [data, setData] = useState<LoginData>({ email: "", password: "" });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL as string;
      const url = `${apiUrl}/users/signin`;
      const { data: res } = await axios.post<{ token: string }>(url, data);
      localStorage.setItem("token", res.token);
      window.location.href = "/";
    } catch (err: any) {
      console.error(err.response?.data?.message || "An error occurred");
      if (!err.response?.data?.success) {
        setError(err.response?.data?.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:w-1/2 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold">Login to Your Account</h1>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {error && <div className="text-red-500">{error}</div>}
            {loading && <Loader />}
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Sign In
            </button>
          </form>
        </div>
        <div className="md:w-1/2 bg-gray-200 p-8 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold mb-4">New Here?</h1>
          <Link to="/signup">
            <button
              type="button"
              className="bg-white text-gray-800 py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
