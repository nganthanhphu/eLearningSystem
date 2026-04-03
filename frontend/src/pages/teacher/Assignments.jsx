import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAssignments } from "../../hooks/useAssignments";
import { useTeacherAssignment } from "../../hooks/useTeacherAssignment";
import AssignmentModal from "../../components/teacher-modals/AssignmentModal";

export default function AssignmentDetail() {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const {
    assignments,
    loading: assignmentsLoading,
    fetchAssignments,
  } = useAssignments(lessonId);
  const {
    createAssignment,
    updateAssignment,
    deleteAssignment,
    loading: actionLoading,
  } = useTeacherAssignment();

  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const handleCreateNew = () => {
    setEditingAssignment(null);
    setShowModal(true);
  };

  const handleEdit = (assignment) => {
    setEditingAssignment(assignment);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có tin chắc muốn xóa bài tập này không?")) {
      const success = await deleteAssignment(id);
      if (success) {
        fetchAssignments(`/lessons/${lessonId}/assignments/`);
      }
    }
  };

  const handleSaveAssignment = async (assignmentData) => {
    let success = false;
    if (editingAssignment) {
      success = await updateAssignment(editingAssignment.id, assignmentData);
    } else {
      success = await createAssignment({ ...assignmentData, lesson: lessonId });
    }

    if (success) {
      setShowModal(false);
      setEditingAssignment(null);
      fetchAssignments(`/lessons/${lessonId}/assignments/`);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <button
        className="btn btn-outline-secondary mb-4 btn-sm px-3"
        onClick={() => navigate(-1)}
      >
        Quay lại Bài giảng
      </button>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0 text-primary">Quản lý Bài tập</h3>
        <button
          className="btn btn-primary px-3 d-flex align-items-center gap-2"
          onClick={handleCreateNew}
          disabled={actionLoading || assignmentsLoading}
        >
          Thêm bài tập
        </button>
      </div>

      <hr />

      {assignmentsLoading ? (
        <p className="text-muted">Đang tải danh sách bài tập...</p>
      ) : assignments && assignments.length > 0 ? (
        <div className="row g-3">
          {assignments.map((assignment, index) => (
            <div key={assignment.id} className="col-12">
              <div className="card shadow-sm border-1">
                <div className="card-body d-flex justify-content-between align-items-start">
                  <div>
                    <h5 className="card-title fw-bold">
                      Bài {index + 1}: {assignment.title}
                    </h5>
                    {assignment.content && (
                      <p
                        className="card-text text-muted mb-0"
                        style={{ whiteSpace: "pre-line" }}
                      >
                        {assignment.content}
                      </p>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-2 ms-3 flex-shrink-0">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(assignment)}
                      disabled={actionLoading}
                    >
                      Sửa
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(assignment.id)}
                      disabled={actionLoading}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-light border border-secondary text-center text-muted p-4">
          Bài giảng này hiện chưa có bài tập nào. Hãy "Thêm bài tập" để giao cho
          học viên.
        </div>
      )}

      <AssignmentModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSave={handleSaveAssignment}
        initialData={editingAssignment}
      />
    </div>
  );
}
