import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";
import { toast } from "react-toastify";

export const useLessons = (courseId) => {
  const [cookies] = useCookies(["access_token"]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchLessons = useCallback(
    async (url) => {
      setLoading(true);
      try {
        const response = await authApis(cookies.access_token).get(url);
        const data = response?.data || {};
        setLessons(data?.results || []);
        setNext(data?.next || null);
        setPrevious(data?.previous || null);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [cookies.access_token],
  );

  useEffect(() => {
    if (courseId) {
      fetchLessons(endpoints["lessons"](courseId));
    }
  }, [courseId, fetchLessons]);

  const goToNextPage = () => {
    if (next) fetchLessons(next);
  };

  const goToPreviousPage = () => {
    if (previous) fetchLessons(previous);
  };

  const createLesson = async (lessonData) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).post(
        endpoints["lesson-manage"],
        lessonData,
      );
      if (response.status === 201) {
        toast.success("Tạo bài học thành công");
        return true;
      }
    } catch (error) {
      console.error("Create lesson error:", error);
      toast.error("Tạo bài học thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateLesson = async (id, lessonData) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).patch(
        endpoints["lesson-item"](id),
        lessonData,
      );
      if (response.status === 200) {
        toast.success("Cập nhật bài học thành công");
        return true;
      }
    } catch (error) {
      console.error("Update lesson error:", error);
      toast.error("Cập nhật bài học thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteLesson = async (id) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).delete(
        endpoints["lesson-item"](id),
      );
      if (response.status === 204) {
        toast.success("Xóa bài học thành công");
        return true;
      }
    } catch (error) {
      console.error("Delete lesson error:", error);
      toast.error("Xóa bài học thất bại");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    lessons,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
    fetchLessons,
    deleteLesson,
    createLesson,
    updateLesson,
  };
};
