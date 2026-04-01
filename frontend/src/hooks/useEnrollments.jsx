import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";

export const useEnrollment = () => {
  const [cookies] = useCookies(["access_token"]);

  const postEnrollment = useCallback(
    async (courseId) => {
      try {
        const formData = new FormData();
        formData.append("course", courseId);
        return await authApis(cookies.access_token).post(
          endpoints["enrollments"],
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } catch (error) {
        throw error;
      }
    },
    [cookies.access_token],
  );

  return { postEnrollment };
};

export const useEnrollments = () => {
  const [cookies] = useCookies(["access_token"]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchEnrollments = useCallback(
    async (url) => {
      setLoading(true);
      try {
        const response = await authApis(cookies.access_token).get(url);
        const data = response?.data || {};
        setEnrollments(data?.results || []);
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
    fetchEnrollments(endpoints["enrollments"]);
  }, [fetchEnrollments]);

  const goToNextPage = () => {
    if (next) fetchEnrollments(next);
  };

  const goToPreviousPage = () => {
    if (previous) fetchEnrollments(previous);
  };

  return {
    enrollments,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
  };
};
