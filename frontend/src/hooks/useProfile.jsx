import { useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";

export const useProfile = () => {
  const [cookies, setCookie] = useCookies(["access_token", "user_info"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(profileData).forEach((key) => {
        formData.append(key, profileData[key]);
      });

      const response = await authApis(cookies.access_token).patch(
        endpoints["current-user"],
        formData,
      );

      //Update lai cookie trong profile
      const currentUserInfo =
        typeof cookies.user_info === "string"
          ? JSON.parse(cookies.user_info)
          : cookies.user_info || {};

      const updatedUser = { ...currentUserInfo, ...response.data };
      setCookie("user_info", JSON.stringify(updatedUser), { path: "/" });

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Lỗi cập nhật thông tin:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Có lỗi xảy ra khi cập nhật thông tin.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(passwordData).forEach((key) => {
        formData.append(key, passwordData[key]);
      });

      const response = await authApis(cookies.access_token).patch(
        endpoints["current-user"],
        formData,
      );

      return { success: true, data: response.data };
    } catch (err) {
      console.error("Lỗi đổi mật khẩu:", err);
      let errorMsg = "Có lỗi xảy ra khi đổi mật khẩu.";

      if (err.response?.data) {
        const data = err.response.data;
        if (Array.isArray(data) && data.length > 0) {
          errorMsg = data[0];
        } else if (typeof data === "object") {
          errorMsg =
            data.message ||
            data.detail ||
            data.non_field_errors?.[0] ||
            Object.values(data)[0]?.[0] ||
            errorMsg;
        } else if (typeof data === "string") {
          errorMsg = data;
        }
      }

      if (
        typeof errorMsg === "string" &&
        errorMsg.toLowerCase().includes("incorrect old password")
      ) {
        errorMsg = "Mật khẩu hiện tại không chính xác.";
      }

      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    updatePassword,
    loading,
    error,
  };
};
