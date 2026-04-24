import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  useSubmissionforPatch,
  useSubmission,
} from "../../hooks/useSubmission";
import { useAssignments } from "../../hooks/useAssignments";
import { toast } from "react-toastify";

const formatDateTime = (value) => {
  const date = new Date(value);
  return date.toLocaleString("vi-VN");
};

const Submission = () => {
  const { assignmentId } = useParams();
  const navigation = useNavigate();
  const { submission, setSubmission, loading, error } =
    useSubmission(assignmentId);
  const { fetchAssignmentById } = useAssignments();
  const { postSubmission, patchSubmission } = useSubmissionforPatch();
  const [modify, setModify] = useState(false);
  const [content, setContent] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState("");
  const [assignmentContent, setAssignmentContent] = useState(
    "Không có nội dung bài tập.",
  );

  const loadAssignmentDetails = useCallback(async () => {
    try {
      const data = await fetchAssignmentById(assignmentId);
      setAssignmentTitle(data?.title || "Bài tập");
      setAssignmentContent(data?.content || "Không có nội dung bài tập.");
    } catch (error) {
      console.error("Error fetching assignment details:", error);
      toast.error("Không thể tải chi tiết bài tập.");
    }
  }, [fetchAssignmentById, assignmentId]);

  useEffect(() => {
    if (submission?.content) setContent(submission.content);
    loadAssignmentDetails();
  }, [loadAssignmentDetails, submission]);

  const handleClickPatch = async () => {
    if (!content.trim()) return toast.error("Nội dung không được để trống.");
    let updatedData;
    if (submission?.id) {
      updatedData = await patchSubmission(submission.id, content);
    } else {
      updatedData = await postSubmission(+assignmentId, content);
    }
    setSubmission(updatedData?.data);
    setModify(false);
    toast.success("Cập nhật bài nộp thành công.");
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
        <h2 className="mb-3">Nộp bài</h2>

        <div className="mb-4">
          <h5 className="mb-2">{assignmentTitle}</h5>
          <p className="text-muted mb-0">{assignmentContent}</p>
        </div>

        {loading ? (
          <p className="text-muted">Đang tải...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : !submission?.content || modify ? (
          <>
            <h6 className="mb-3">
              {!submission?.content ? "Nộp bài" : "Sửa bài"}
            </h6>

            <textarea
              className="form-control mb-3"
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung..."
            />

            <button className="btn btn-success me-2" onClick={handleClickPatch}>
              {submission?.content ? "Cập nhật" : "Nộp"}
            </button>

            {submission?.content && (
              <button
                className="btn btn-secondary"
                onClick={() => setModify(false)}
              >
                Hủy sửa
              </button>
            )}
          </>
        ) : (
          <>
            <h6 className="mb-3">Bài đã nộp</h6>

            <div className="list-group mb-3">
              <div className="list-group-item">
                <strong>Nội dung:</strong>
                <p className="mt-1 mb-0">{submission.content}</p>
              </div>

              <div className="list-group-item d-flex justify-content-between">
                <span>
                  <strong>Ngày nộp:</strong>{" "}
                  {formatDateTime(submission.submitted_at)}
                </span>
                <span className="text-danger">
                  <strong>Điểm:</strong> {submission.grade ?? "--"}
                </span>
              </div>

              <div className="list-group-item">
                <strong>Nhận xét:</strong>
                <p className="mt-1 mb-0">{submission.comment || "--"}</p>
              </div>
            </div>

            <button className="btn btn-warning" onClick={() => setModify(true)}>
              Sửa
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Submission;
