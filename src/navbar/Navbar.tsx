import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const location = useLocation();
  const JWT_TOKEN = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      if (!JWT_TOKEN) {
        return;
      }
      const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
      const url = `${apiUrl}/users/logout`;
      await axios.post(url, null, {
        headers: {
          Authorization: `Bearer ${JWT_TOKEN}`,
        },
      });
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog App</h1>
        <div
          className={`flex flex-col md:flex-row md:items-center ${
            menuOpen ? "block" : "hidden"
          } md:block`}
        >
          <Link
            to="/"
            className={`px-4 py-2 ${
              location.pathname === "/" ? "text-blue-500" : "text-gray-700"
            } hover:text-blue-500`}
            onClick={toggleMenu}
          >
            Blog
          </Link>
          {JWT_TOKEN ? (
            <button
              className="px-4 py-2 text-gray-700 hover:text-white hover:bg-blue-500 transition duration-300 ease-in-out transform hover:scale-105 rounded-md"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 ${
                location.pathname === "/login"
                  ? "text-blue-500"
                  : "text-gray-700"
              } hover:text-blue-500`}
              onClick={toggleMenu}
            >
              Login
            </Link>
          )}
        </div>
        <div className="md:hidden" onClick={toggleMenu}>
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBars}
            className="text-2xl text-gray-700"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
