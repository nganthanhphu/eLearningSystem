import React, { useState } from "react";
import { useCourses } from "../hooks/useCourse";
import PaginationControls from "../components/PaginationControls";
import { useEnrollment } from "../hooks/useEnrollments";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ROLES } from "../config/roles";
import CourseModal from "../components/CourseModal";

export default function Course() {
  const {
    courses,
    loading,
    next,
    previous,
    postCourse,
    goToNextPage,
    goToPreviousPage,
    keyword,
    setKeyword,
  } = useCourses();
  const { postEnrollment } = useEnrollment();
  const [cookies] = useCookies(["access_token", "user_info"]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const getCurrentUserRole = () => {
    if (!cookies.user_info) {
      return null;
    }

    try {
      const userInfo =
        typeof cookies.user_info === "string"
          ? JSON.parse(cookies.user_info)
          : cookies.user_info;

      return userInfo?.role ?? null;
    } catch (error) {
      console.error("Invalid user info format in cookies", error);
      return null;
    }
  };

  const handleEnroll = async (courseId) => {
    if (!cookies.access_token) {
      navigate("/");
      return;
    }

    const role = getCurrentUserRole();
    if (role !== ROLES.STUDENT) {
      navigate("/");
      return;
    }

    try {
      const response = await postEnrollment(courseId);

      if (response.status === 201) {
        toast.success("Đăng ký khóa học thành công!");
        return;
      }

      toast.error("Lỗi không xác định");
    } catch (error) {
      if (error?.response?.status === 400) {
        const nonFieldErrors = error?.response?.data?.non_field_errors;

        if (
          Array.isArray(nonFieldErrors) &&
          nonFieldErrors.includes("You are already enrolled in this course.")
        ) {
          toast.info("Bạn đã đăng ký khóa học này");
          return;
        }
      }

      toast.error("Lỗi không xác định");
    }
  };

  const handleCreateCourse = async (courseData) => {
    let success = await postCourse(courseData);

    if (success) setShowModal(false);
  };

  return (
    <>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Tìm kiếm..."
        className="form-control mb-3"
      />

      {getCurrentUserRole() === ROLES.TEACHER && (
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => {
            setShowModal(true);
          }}
        >
          Thêm khóa học
        </button>
      )}

      {loading ? (
        <p className="text-center text-muted">Đang tải khóa học...</p>
      ) : courses.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="card shadow-sm border-1 rounded h-100"
              style={{
                cursor:
                  getCurrentUserRole() === ROLES.TEACHER
                    ? "pointer"
                    : "default",
              }}
              onClick={() => {
                getCurrentUserRole() === ROLES.TEACHER &&
                  navigate(`/teacher/courses/${course.id}/lessons`);
              }}
            >
              <div className="card-body">
                <h5 className="card-title fw-bold text-primary">
                  {course?.title}
                </h5>
                <p className="card-text text-muted">{course?.description}</p>
                <div className="d-flex align-items-center gap-2">
                  {getCurrentUserRole() === ROLES.STUDENT && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Đăng ký
                    </button>
                  )}
                </div>
                <hr />
                <h6 className="mb-0 fw-bold mb-2">Giáo viên phụ trách:</h6>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={course?.teacher?.avatar}
                      className="rounded-circle"
                      style={{
                        width: "32px",
                        height: "32px",
                        objectFit: "cover",
                      }}
                      alt="teacher-avatar"
                    />
                    <div>
                      <div className="fw-semibold text-danger">
                        {course?.teacher?.last_name}{" "}
                        {course?.teacher?.first_name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">Không có khóa học nào</p>
      )}

      <PaginationControls
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        hasPrevious={!!previous}
        hasNext={!!next}
      />

      <CourseModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleCreateCourse}
        initialData={null}
      />
    </>
  );
}
