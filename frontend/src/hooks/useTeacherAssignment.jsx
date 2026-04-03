import { useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";
import { toast } from "react-toastify";

export const useTeacherAssignment = () => {
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(false);

  const createAssignment = async (assignmentData) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).post(
        endpoints["assignment-manage"],
        assignmentData,
      );
      if (response.status === 201) {
        toast.success("Tạo bài tập thành công");
        return true;
      }
    } catch (error) {
      console.error("Create assignment error:", error);
      toast.error("Tạo bài tập thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id, assignmentData) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).patch(
        endpoints["assignment-detail"](id),
        assignmentData,
      );
      if (response.status === 200) {
        toast.success("Cập nhật bài tập thành công");
        return true;
      }
    } catch (error) {
      console.error("Update assignment error:", error);
      toast.error("Cập nhật bài tập thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).delete(
        endpoints["assignment-detail"](id),
      );
      if (response.status === 204) {
        toast.success("Xóa bài tập thành công");
        return true;
      }
    } catch (error) {
      console.error("Delete assignment error:", error);
      toast.error("Xóa bài tập thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};
