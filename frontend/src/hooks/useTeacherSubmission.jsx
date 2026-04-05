import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { authApis, endpoints } from "../api/Apis";

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
export const useTeacherSubmissionforPatch = () => {
  const [cookies] = useCookies(["access_token"]);
  const patchSubmission = useCallback(
    async (submissionId, grade, comment) => {
      try {
        return await authApis(cookies.access_token).patch(
          endpoints["submission-detail"](submissionId),
          {
            grade: +grade,
            comment: comment,
          },
        );
      } catch (error) {
        throw error;
      }
    },
    [cookies.access_token],
  );

  return { patchSubmission };
};

export const useTeacherSubmission = (submissionId) => {
  const [cookies] = useCookies(["access_token"]);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubmission = useCallback(async () => {
    if (!submissionId) {
      setSubmission(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authApis(cookies.access_token).get(
        endpoints["submission-detail"](submissionId),
      );
      setSubmission(normalizeSubmission(response?.data));
    } catch (err) {
      console.error("Fetch submission error:", err);
      setSubmission(null);
      setError("Không thể tải bài đã nộp.");
    } finally {
      setLoading(false);
    }
  }, [submissionId, cookies.access_token]);

  useEffect(() => {
    fetchSubmission();
  }, [fetchSubmission]);

  return {
    submission,
    setSubmission,
    loading,
    error,
    refetch: fetchSubmission,
  };
};
