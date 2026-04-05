import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";
import { useParams } from "react-router-dom";

const normalizeSubmission = (data) => {
  if (Array.isArray(data)) {
    return data[0] || null;
  }

  if (Array.isArray(data?.results)) {
    return data.results[0] || null;
  }

  if (data && typeof data === "object" && Object.keys(data).length > 0) {
    return data;
  }

  return null;
};

export const useSubmission = (assignmentId) => {
  const [cookies] = useCookies(["access_token"]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmission = useCallback(async () => {
    if (!assignmentId) {
      setSubmission(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApis(cookies.access_token).get(
        endpoints["submissions"](assignmentId),
      );
      setSubmission(normalizeSubmission(response?.data));
    } catch (err) {
      console.error("Fetch submission error:", err);
      setSubmission(null);
      setError("Không thể tải bài đã nộp.");
    } finally {
      setLoading(false);
    }
  }, [assignmentId, cookies.access_token]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  return { submission, loading, error, refetch: fetchSubmission };
};

export const useSubmissions = (showAll) => {
  const [cookies] = useCookies(["access_token"]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchSubmissions = useCallback(
    async (url) => {
      setLoading(true);
      setError(null);
      if (!url) url = endpoints["submission"] + "?graded=" + showAll;
      try {
        const response = await authApis(cookies.access_token).get(url);
        setSubmissions(response?.data?.results || []);
        setNext(response?.data?.next || null);
        setPrevious(response?.data?.previous || null);
      } catch (err) {
        console.error("Fetch submission error:", err);
        setSubmissions([]);
        setError("Không thể tải bài đã nộp.");
      } finally {
        setLoading(false);
      }
    },
    [cookies.access_token, showAll],
  );
  const goToNextPage = () => {
    if (next) fetchSubmissions(next);
  };

  const goToPreviousPage = () => {
    if (previous) fetchSubmissions(previous);
  };

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    refetch: fetchSubmissions,
    goToNextPage,
    goToPreviousPage,
    next,
    previous,
  };
};
