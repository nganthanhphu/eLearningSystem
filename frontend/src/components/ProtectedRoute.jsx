import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();
  const [cookies] = useCookies(["access_token", "user_info"]);

  const getRoleFromCookie = () => {
    if (!cookies.user_info) {
      return null;
    }

    try {
      const userInfo =
        typeof cookies.user_info === "string"
          ? JSON.parse(cookies.user_info)
          : cookies.user_info;

      return userInfo?.role ?? null;
    } catch (error) {
      console.error("Invalid user info format in cookies", error);
      return null;
    }
  };

  if (!cookies.access_token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const role = getRoleFromCookie();

    if (!role || !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  if (!children) {
    return <Navigate to="/" replace />;
  }

  return children;
}