import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";

export const useLessons = (courseId) => {
  const [cookies] = useCookies(["access_token"]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchLessons = useCallback(async (url) => {
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
  }, [cookies.access_token]);

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

  return { lessons, loading, next, previous, goToNextPage, goToPreviousPage };
};