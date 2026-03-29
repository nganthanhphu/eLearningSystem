import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";

export const useCourses = () => {
  const [cookies] = useCookies(["access_token"]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [keyword, setKeyword] = useState("");

  const fetchCourses = useCallback(async (url, params = {}) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).get(url, { params });
      const data = response?.data || {};
      setCourses(data?.results || []);
      setNext(data?.next || null);
      setPrevious(data?.previous || null);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [cookies.access_token]);

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

  return { courses, loading, next, previous, goToNextPage, goToPreviousPage, keyword, setKeyword };
};
