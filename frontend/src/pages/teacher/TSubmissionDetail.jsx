import { useLayoutEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useTeacherSubmission,
  useTeacherSubmissionforPatch,
} from "../../hooks/useTeacherSubmission";

const formatDateTime = (value) => {
  const date = new Date(value);
  return date.toLocaleString("vi-VN");
};

export default function TSubmissionDetail() {
  const { submissionId } = useParams();
  const navigation = useNavigate();
  const { submission, setSubmission, loading, error } =
    useTeacherSubmission(submissionId);
  const { patchSubmission } = useTeacherSubmissionforPatch();

  const [modify, setModify] = useState(false);
  const [grade, setGrade] = useState(submission?.grade || "");
  const [comment, setComment] = useState(submission?.comment || "");
  const assignmentTitle = submission?.assignment?.title || "Bài tập";
  const assignmentContent =
    submission?.assignment?.content || "Không có nội dung bài tập.";

  useLayoutEffect(() => {
    if (submission) {
      setGrade(submission.grade || "");
      setComment(submission.comment || "");
    }
  }, [submission]);
  const handleClickPatch = async () => {
    if (!grade) return toast.error("Điểm số không được để trống.");
    if (submission?.id) await patchSubmission(submission.id, grade, comment);
    setSubmission((prev) => ({
      ...prev,
      grade: grade,
      comment: comment,
      submitted_at: new Date().toISOString(),
    }));
    setModify(false);
    toast.success("Cập nhật thành công.");
  };
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <button
          className="btn btn-secondary mb-3"
          onClick={() => navigation(-1)}
        >
          Quay lại
        </button>
        <h2 className="mb-3">Chấm bài</h2>

        <div className="mb-3">
          <h5 className="mb-2">{assignmentTitle}</h5>
          <p className="text-muted mb-2">Nội dung bài tập:</p>
          <div className="mb-2 p-3 border rounded" style={{ backgroundColor: "#f8f9fa" }}>
            <p className="mb-0">{assignmentContent}</p>
          </div>
        </div>
        <hr />
        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : !submission?.grade || modify ? (
          <>
            <div className="mb-3">
              <p>
                Học sinh: <span className="fw-bold">{submission?.student?.last_name} {submission?.student?.first_name}</span>
              </p>
              <p className="text-muted">
                Ngày nộp: <span className="fw-bold">{formatDateTime(submission?.submitted_at)}</span>
              </p>
              <strong>Bài làm:</strong>
              <div className="h-100 p-3 border rounded" style={{ backgroundColor: "#eaeaea" }}>
                <p>{submission?.content}</p>
              </div>
            </div>
            <hr />
            <div className="d-flex align-items-center gap-2 mb-3">
              <h6 className="mb-3">Điểm :</h6>
              <input
                type="number"
                className="form-control mb-3"
                style={{ width: "120px" }}
                value={grade}
                min="0"
                max="10"
                step="0.25"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0 && value <= 10) {
                    setGrade(value);
                  }
                }}
              />
            </div>
            <h6 className="mb-3">Nhận xét :</h6>
            <textarea
              className="form-control mb-3"
              rows={4}
              placeholder="Nhận xét..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button className="btn btn-success me-2" onClick={handleClickPatch}>
              Lưu
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setModify(false)}
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <div className="list-group mb-3">
              <div className="list-group-item">
                <strong>Nội dung:</strong>
                <div className="h-100 p-3 border rounded" style={{ backgroundColor: "#eaeaea" }}>
                  <p className="mt-1 mb-0">{submission.content}</p>
                </div>
              </div>

              <div className="list-group-item d-flex justify-content-between">
                <span>
                  <strong>Ngày nộp:</strong>{" "}
                  {formatDateTime(submission.submitted_at)}
                </span>
                <div className="d-flex gap-2 flex-shrink-0">
                  <div>Điểm: </div>
                  <div
                    className={`btn btn-sm px-3 text-white ${submission?.grade ? "btn-danger" : "btn-secondary"}`}
                  >
                    {submission?.grade || "_"}
                  </div>
                </div>
              </div>

              <div className="list-group-item">
                <strong>Nhận xét:</strong>
                <p className="mt-1 mb-0">{submission.comment || "--"}</p>
              </div>
            </div>

            <button className="btn btn-warning" onClick={() => setModify(true)}>
              {submission.grade ? "Sửa điểm" : "Chấm bài"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
