import React from "react";
import { useParams } from "react-router-dom";
import { useSubmission } from "../../hooks/useSubmission";

const formatDateTime = (value) => {
  const date = new Date(value);
  return date.toLocaleString("vi-VN");
};

const Submission = () => {
  const { assignmentId } = useParams();

  const { submission, setSubmission, loading, error } =
    useSubmission(assignmentId);
  const { postSubmission, patchSubmission } = useSubmissionforPatch();
  // chế độ sửa
  const [modify, setModify] = useState(false);
  const [content, setContent] = useState("");


  const assignmentTitle = submission?.assignment?.title || "Bài tập";
  const assignmentContent = submission?.assignment?.content || "Không có nội dung bài tập.";
  const handleClickPatch = async () => {
    if (!content.trim()) return;
    if (submission?.id) await patchSubmission(submission.id, content);
    else await postSubmission(+assignmentId, content);
    setSubmission((prev) => ({
      ...prev,
      content: content,
      submitted_at: new Date().toISOString(),
      grade: null,
      comment: null,
    }));
    setModify(false);
  };
  
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h2 className="mb-3">Nộp bài</h2>

        <div className="mb-4">
          <h5 className="mb-2">{assignmentTitle}</h5>
          <p className="text-muted mb-0">{assignmentContent}</p>
        </div>

        {loading ? (
          <p className="text-muted mb-0">Đang tải bài đã nộp...</p>
        ) : error ? (
          <p className="text-danger mb-0">{error}</p>
        ) : submission?.content ? (
          <>
            <h6 className="mb-3">Bài đã nộp</h6>
            <div className="list-group mb-3">
              <div className="list-group-item">
                <strong>Nội dung:</strong>
                <p className="mb-0 mt-1">{submission.content || "--"}</p>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center">
                <span>
                  <strong>Ngày nộp:</strong> {formatDateTime(submission.submitted_at)}
                </span>
                <span className="text-danger">
                  <strong>Điểm:</strong> {submission.grade ?? "--"}
                </span>
              </div>
              <div className="list-group-item">
                <strong>Nhận xét:</strong>
                <p className="mb-0 mt-1">{submission.comment || "--"}</p>
              </div>
            </div>
            <button type="button" className="btn btn-warning">
              Sửa
            </button>
          </>
        ) : (
          <>
            <p className="text-muted">Chưa có bài nộp cho bài tập này.</p>
            <button type="button" className="btn btn-primary">
              Nộp
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Submission;
