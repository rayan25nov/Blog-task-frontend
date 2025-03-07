import { toast } from "react-toastify";
import axios from "axios";

// Check if the user is authenticated
const handleAuthCheck = (JWT_TOKEN: string | null): boolean => {
  if (!JWT_TOKEN) {
    toast.error("You need to sign in to perform this action.", {
      position: "top-right",
      autoClose: 3000,
    });
    return false;
  }
  return true;
};

const AuthUser = async (blogId: string, apiUrl: string): Promise<boolean> => {
  // Retrieve the JWT token from localStorage
  const JWT_TOKEN = localStorage.getItem("token");
  if (!JWT_TOKEN) {
    throw new Error("No JWT token found");
  }
  const url = `${apiUrl}/blogs/user/blogId`;
  try {
    // Pass the token in the Authorization header
    const { data: res } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    });
    // Check if the postId exists in the user's authorized posts
    const blogIds: string[] = res.blogIds || [];
    console.log("Authorized blog IDs:", blogIds);

    // Ensure both are strings for comparison
    const isAuthorized = blogIds.includes(blogId.toString());
    return isAuthorized;
  } catch (error) {
    console.error("Authorization failed:", error);
    return false; // Not authorized
  }
};

export { handleAuthCheck, AuthUser };
