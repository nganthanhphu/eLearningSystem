import React, { useState } from "react";
import { useCourseDetail } from "../../hooks/useCourseDetail";
import { useParams, useNavigate } from "react-router-dom";
import CourseModal from "../../components/CourseModal";
import { useLessons } from "../../hooks/useLessons";
import { useCourses } from "../../hooks/useCourse";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { courseDetail, loading } = useCourseDetail(courseId);
  const { lessons, loading: lessonsLoading } = useLessons(courseId);
  const { deleteCourse, updateCourse } = useCourses();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);

  const handleEdit = () => {
    setShowModal(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleDelete = async () => {
    if (
      window.confirm(
        "Bạn có tin chắc muốn xóa khóa học này không? Hành động này sẽ ẩn khóa học khỏi hệ thống.",
      )
    ) {
      const success = await deleteCourse(courseId);
      if (success) {
        navigate("/courses");
      }
    }
  };

  const handleSaveCourse = async (courseData) => {
    const success = await updateCourse(courseId, courseData);
    if (success) {
      setShowModal(false);
      window.location.reload();
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-start mb-4">
        <div>
          <h2 className="fw-bold mb-2 text-primary">{courseDetail?.title}</h2>
          <p className="text-muted" style={{ whiteSpace: "pre-line" }}>
            {courseDetail?.description || (
              <span className="fst-italic">Không có mô tả</span>
            )}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-warning px-3" onClick={handleEdit}>
            Sửa
          </button>
          <button className="btn btn-danger px-3" onClick={handleDelete}>
            Xóa
          </button>
        </div>
      </div>

      <hr />

      <div className="mt-4">
        <h4 className="fw-bold mb-3">Danh sách Bài học</h4>
        {lessonsLoading ? (
          <p className="text-muted">Đang tải danh sách bài học...</p>
        ) : lessons && lessons.length > 0 ? (
          <ul className="list-group">
            {lessons.map((lesson, index) => (
              <li
                key={lesson.id}
                className="list-group-item d-flex justify-content-between align-items-center p-3"
              >
                <div className="d-flex align-items-baseline gap-3">
                  <span className="fw-bold text-secondary">
                    Bài {index + 1}:
                  </span>
                  <span className="fw-medium fs-5">{lesson.title}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-light border border-secondary text-center text-muted p-4">
            Khóa học này hiện chưa có bài học nào.
          </div>
        )}
      </div>

      <CourseModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveCourse}
        initialData={courseDetail}
      />
    </div>
  );
}
