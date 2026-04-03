import React, { useState } from "react";
import { useLessons } from "../../hooks/useLessons";
import LessonModal from "../../components/teacher-modals/LessonModal";
import { endpoints } from "../../api/Apis";
import PaginationControls from "../../components/PaginationControls";
import { useNavigate } from "react-router-dom";

export default function Lesson({ courseId }) {
  const {
    lessons,
    loading,
    fetchLessons,
    createLesson,
    updateLesson,
    deleteLesson,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
  } = useLessons(courseId);

  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const navigate = useNavigate();

  const handleCreateNew = () => {
    setEditingLesson(null);
    setShowModal(true);
  };

  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bài học này không?")) {
      const success = await deleteLesson(id);
      if (success && courseId) {
        fetchLessons(endpoints["lessons"](courseId));
      }
    }
  };

  const handleSaveLesson = async (lessonData) => {
    let success = false;
    if (editingLesson) {
      success = await updateLesson(editingLesson.id, lessonData);
    } else {
      success = await createLesson({ ...lessonData, course: courseId });
    }

    if (success) {
      setShowModal(false);
      setEditingLesson(null);
      if (courseId) {
        fetchLessons(endpoints["lessons"](courseId));
      }
    }
  };

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Danh sách Bài học</h4>
        <button
          className="btn btn-primary btn-sm px-3"
          onClick={handleCreateNew}
          disabled={loading}
        >
          Thêm bài học
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Đang tải danh sách bài học...</p>
      ) : lessons && lessons.length > 0 ? (
        <ul className="list-group">
          {lessons.map((lesson, index) => (
            <li
              key={lesson.id}
              className="list-group-item d-flex justify-content-between align-items-start p-3"
            >
              <div className="me-2">
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <span className="fw-medium fs-5">{lesson.title}</span>
                </div>

                {lesson.content && (
                  <p
                    className="text-muted mb-0"
                    style={{ whiteSpace: "pre-line", fontSize: "0.95em" }}
                  >
                    {lesson.content}
                  </p>
                )}
              </div>
              <div className="d-flex gap-2 flex-shrink-0">
                <button
                  className="btn btn-info btn-sm px-3 text-white"
                  onClick={() =>
                    navigate(`/teacher/lessons/${lesson.id}/assignments`)
                  }
                  disabled={loading}
                >
                  Bài tập
                </button>
                <button
                  className="btn btn-warning btn-sm px-3"
                  onClick={() => handleEdit(lesson)}
                  disabled={loading}
                >
                  Sửa
                </button>
                <button
                  className="btn btn-danger btn-sm px-3"
                  onClick={() => handleDelete(lesson.id)}
                  disabled={loading}
                >
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-light border border-secondary text-center text-muted p-4">
          Khóa học này hiện chưa có bài học nào.
        </div>
      )}

      <LessonModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveLesson}
        initialData={editingLesson}
      />

      <PaginationControls
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        hasNext={next}
        hasPrevious={previous}
      />
    </div>
  );
}
