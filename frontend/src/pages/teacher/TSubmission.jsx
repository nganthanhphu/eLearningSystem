import { useState } from "react";
import { useSubmissions } from "../../hooks/useSubmission";
import { useNavigate } from "react-router-dom";
import PaginationControls from "../../components/PaginationControls";

export default function TSubmission() {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const {
    submissions,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
  } = useSubmissions(showAll);
  const handleButtonClick = (submissionId) => {
    navigate(`/teacher/submissions/${submissionId}`);
  };
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold mb-0">Danh sách bài nộp của học sinh</h4>
        <button
          className="btn btn-primary"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? "Chỉ hiện bài cần chấm " : "Hiện tất cả"}
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Đang tải danh sách ...</p>
      ) : submissions && submissions.length > 0 ? (
        <ul className="list-group">
          {submissions.map((submission, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-start p-3"
            >
              <div className="me-2">
                <div className="d-flex align-items-baseline gap-2 mb-1">
                  <span className="fw-medium fs-5">
                    {submission?.assignment?.title}
                  </span>
                </div>

                <p
                  className="text-muted mb-0"
                  style={{ whiteSpace: "pre-line", fontSize: "0.95em" }}
                >
                  Bài làm của {submission?.student?.last_name}{" "}
                  {submission?.student?.first_name} - Nộp vào{" "}
                  {new Date(submission?.submitted_at).toLocaleString()}
                </p>
              </div>
              <div className="d-flex gap-2 flex-shrink-0">
                <div>Điểm: </div>
                <div
                  className={`btn btn-sm px-3 text-white ${submission?.grade ? "btn-info" : "btn-secondary"}`}
                >
                  {submission?.grade || "_"}
                </div>
                <button
                  className="btn btn-warning btn-sm px-3"
                  onClick={() => handleButtonClick(submission?.id)}
                >
                  {submission?.grade ? "Chấm bài" : "Chấm lại"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-light border border-secondary text-center text-muted p-4">
          Hiện chưa có bài nào .
        </div>
      )}

      <PaginationControls
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        hasNext={next}
        hasPrevious={previous}
      />
    </div>
  );
}
