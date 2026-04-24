import { useCookies } from "react-cookie";

import { useCallback, useEffect, useState } from "react";
import { authApis, endpoints } from "../api/Apis";

export const useCertificates = () => {
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificate] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);

  const fetchCertificates = useCallback(
    async (url) => {
      setLoading(true);
      try {
        const response = await authApis(cookies.access_token).get(url);
        const data = response?.data || {};
        setCertificate(data?.results || []);
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
    fetchCertificates(endpoints["certificates"]);
  }, [fetchCertificates]);
  const goToNextPage = () => {
    if (next) fetchCertificates(next);
  };

  const goToPreviousPage = () => {
    if (previous) fetchCertificates(previous);
  };
  return {
    certificates,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
  };
};
