import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useCourses } from "./useCourse";

export const useCourseDetail = (courseId) => {
  const [cookies] = useCookies(["access_token"]);
  const { getCourseDetail } = useCourses();
  const [courseDetail, setCourseDetail] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      setLoading(true);
      const data = await getCourseDetail(courseId);
      if (data) {
        setCourseDetail(data);
      } else {
        navigate("/courses");
      }
      setLoading(false);
    };

    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId, cookies.access_token, getCourseDetail, navigate]);

  return { courseDetail, loading };
};
