import React, { useState } from "react";
import { useCourseDetail } from "../../hooks/useCourseDetail";
import { useParams, useNavigate } from "react-router-dom";
import CourseModal from "../../components/teacher-modals/CourseModal";
import { useCourses } from "../../hooks/useCourse";
import Lesson from "./Lesson";

export default function CourseDetail() {
  const { courseId } = useParams();
  const { courseDetail, loading } = useCourseDetail(courseId);
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
            {courseDetail?.description || <span>Không có mô tả</span>}
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

      <Lesson courseId={courseId} />

      <CourseModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveCourse}
        initialData={courseDetail}
      />
    </div>
  );
}
