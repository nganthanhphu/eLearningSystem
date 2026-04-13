import { useEnrollments } from "../../hooks/useEnrollments";
import PaginationControls from "../../components/PaginationControls";
import { useNavigate } from "react-router-dom";

const Enrollments = () => {
  const {
    enrollments,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
  } = useEnrollments();

  const navigate = useNavigate();

  const handleCardClick = (courseId) => {
    navigate(`/student/courses/${courseId}/lessons`);
  };

  return (
    <>
      <h2 className="mb-3">Các khóa học đã đăng ký</h2>
      {loading ? (
        <p className="text-center text-muted">Đang tải danh sách khóa học...</p>
      ) : enrollments.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {enrollments.map((enrollment) => {
            const { course, progress } = enrollment;
            return (
              <div
                key={enrollment.id}
                className="card shadow-sm border-1 rounded h-100"
                style={{ cursor: "pointer" }}
                onClick={() => handleCardClick(course.id)}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">
                    {course?.title}
                  </h5>
                  <p className="card-text text-muted">{course?.description}</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-success">
                      Tiến độ: {progress}%
                    </span>
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
                        alt="Ảnh giáo viên"
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
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted">Bạn chưa đăng ký khóa học nào</p>
      )}
      <PaginationControls
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        hasPrevious={!!previous}
        hasNext={!!next}
      />
    </>
  );
};

export default Enrollments;
