import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis } from "../api/Apis";

export const useAssignments = (lessonId) => {
  const [cookies] = useCookies(["access_token"]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchAssignments = useCallback(
    async (url) => {
      setLoading(true);
      try {
        const response = await authApis(cookies.access_token).get(url);
        const data = response?.data || {};
        setAssignments(data?.results || []);
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
  const fetchAssignmentById = async (assid) => {
    setLoading(true);
    try {
      const response = await authApis(cookies.access_token).get(
        `/assignments/${assid}/`,
      );
      return response?.data;
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (lessonId) {
      fetchAssignments(`/lessons/${lessonId}/assignments/`);
    }
  }, [fetchAssignments, lessonId]);

  const goToNextPage = () => {
    if (next) fetchAssignments(next);
  };

  const goToPreviousPage = () => {
    if (previous) fetchAssignments(previous);
  };

  return {
    assignments,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
    fetchAssignments,
    fetchAssignmentById,
  };
};
