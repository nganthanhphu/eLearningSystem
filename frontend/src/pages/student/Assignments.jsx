import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAssignments } from "../../hooks/useAssignments";
import PaginationControls from "../../components/PaginationControls";

const Assignments = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { assignments, loading, next, previous, goToNextPage, goToPreviousPage } = useAssignments(lessonId);

  const handleViewAssignment = (assignment) => {
    navigate(`/student/assignments/${assignment.id}/submission`);
  };

  return (
    <>
      <h2 className="mb-3">Danh sách bài tập</h2>
      {loading ? (
        <p className="text-center text-muted">Đang tải danh sách bài tập...</p>
      ) : assignments.length > 0 ? (
        <ul className="list-group mb-3">
          {assignments.map((assignment) => (
            <li key={assignment.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>{assignment.title}</span>
              <button className="btn btn-primary btn-sm" onClick={() => handleViewAssignment(assignment)}>
                Xem
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">Chưa có bài tập nào</p>
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

export default Assignments;
