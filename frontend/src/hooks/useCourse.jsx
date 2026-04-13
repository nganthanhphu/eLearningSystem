import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";
import { toast } from "react-toastify";

export const useCourses = () => {
  const [cookies] = useCookies(["access_token"]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fetchCourses = useCallback(
    async (url, params = {}) => {
      setLoading(true);
      try {
        const response = await authApis(cookies.access_token).get(url, {
          params,
        });
        const data = response?.data || {};
        setCourses(data?.results || []);
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

  const postCourse = async (courseData) => {
    try {
      const response = await authApis(cookies.access_token).post(
        endpoints["courses"],
        courseData,
      );
      if (response.status === 201) {
        toast.success("Tạo khóa học thành công");
        fetchCourses(endpoints["courses"]);
        return true;
      }
    } catch (error) {
      console.error("Create course error:", error);
      toast.error("Tạo khóa học thất bại");
      return false;
    }
  };

  const updateCourse = async (id, courseData) => {
    try {
      const response = await authApis(cookies.access_token).patch(
        endpoints["course-detail"](id),
        courseData,
      );
      if (response.status === 200) {
        toast.success("Cập nhật khóa học thành công");
        fetchCourses();
        return true;
      }
    } catch (error) {
      console.error("Update course error:", error);
      toast.error("Cập nhật khóa học thất bại");
      return false;
    }
  };

  const deleteCourse = async (id) => {
    try {
      const response = await authApis(cookies.access_token).delete(
        endpoints["course-detail"](id),
      );
      if (response.status === 204) {
        toast.success("Xóa khóa học thành công");
        fetchCourses();
        return true;
      }
    } catch (error) {
      console.error("Delete course error:", error);
      toast.error("Xóa khóa học thất bại");
      return false;
    }
  };

  const getCourseDetail = async (id) => {
    try {
      const response = await authApis(cookies.access_token).get(
        endpoints["course-detail"](id),
      );
      return response.data;
    } catch (error) {
      console.error("Get course detail error:", error);
      toast.error("Lấy chi tiết khóa học thất bại");
      return null;
    }
  };

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchCourses(endpoints["courses"], { kw: keyword });
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [fetchCourses, keyword]);

  const goToNextPage = () => {
    if (next) fetchCourses(next);
  };

  const goToPreviousPage = () => {
    if (previous) fetchCourses(previous);
  };

  return {
    courses,
    loading,
    next,
    previous,
    updateCourse,
    deleteCourse,
    getCourseDetail,
    postCourse,
    goToNextPage,
    goToPreviousPage,
    keyword,
    setKeyword,
  };
};
