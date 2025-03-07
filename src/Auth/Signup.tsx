import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "../loader/Loader";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface ErrorResponse {
  [key: string]: string;
}

const Signup = () => {
  const [data, setData] = useState<SignupData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [msg, setMsg] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.currentTarget.name]: e.currentTarget.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const url = `${apiUrl}/users/signup`;
      const { data: res } = await axios.post(url, data);
      setMsg(res.message);
    } catch (error: any) {
      console.log(error);
      if (error.response && error.response.data && !error.response.data.success) {
        setError(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="md:w-1/2 p-8 bg-gray-200">
          <h1 className="text-2xl font-bold mb-4">Welcome Back</h1>
          <Link to="/login">
            <button
              type="button"
              className="w-full py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Sign in
            </button>
          </Link>
        </div>
        <div className="md:w-1/2 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <h1 className="text-2xl font-bold">Create Account</h1>
            <input
              type="text"
              placeholder="Enter Your Name"
              name="name"
              onChange={handleChange}
              value={data.name}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {error && (
              <div className="text-red-500">
                {Object.values(error).map((errorMsg, index) => (
                  <p key={index}>{errorMsg}</p>
                ))}
              </div>
            )}
            {msg && <div className="text-green-500">{msg}</div>}
            {loading && <Loader />}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
