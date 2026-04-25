import { useCookies } from "react-cookie";

import { useEffect, useState } from "react";
import { authApis, endpoints } from "../api/Apis";

export const useCertificateCard = (cerId) => {
  const [cookies] = useCookies(["access_token"]);
  const [certificateCard, setCertificateCard] = useState(null);

  useEffect(() => {
    const fetchCertificateCard = async () => {
      try {
        setCertificateCard(null);
        const response = await authApis(cookies.access_token).get(endpoints["certificate-detail"](cerId));
        setCertificateCard(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (cerId) {
      fetchCertificateCard();
    }
  }, [cookies.access_token, cerId]);
  return { certificateCard };
};
