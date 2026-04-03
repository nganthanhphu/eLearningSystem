import React, { useEffect, useState } from "react";

export default function AssignmentModal({
  show,
  handleClose,
  handleSave,
  initialData,
}) {
  const [assignmentData, setAssignmentData] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (initialData) {
      setAssignmentData({
        title: initialData.title || "",
        content: initialData.content || "",
      });
    } else {
      setAssignmentData({ title: "", content: "" });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAssignmentData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!assignmentData.title.trim()) return;
    handleSave(assignmentData);
  };

  return (
    <>
      <div
        className={`modal fade ${show ? "show" : ""}`}
        style={{ display: show ? "block" : "none" }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold">
                {initialData ? "Sửa bài tập" : "Thêm bài tập mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit} id="assignmentForm">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tên bài tập <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={assignmentData.title}
                    onChange={handleChange}
                    placeholder="Nhập tên bài tập"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nội dung yêu cầu
                  </label>
                  <textarea
                    name="content"
                    className="form-control"
                    rows={4}
                    value={assignmentData.content}
                    onChange={handleChange}
                    placeholder="Nhập nội dung yêu cầu của bài tập"
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Hủy
              </button>
              <button
                type="submit"
                form="assignmentForm"
                className="btn btn-primary"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
      {show && <div className="modal-backdrop fade show"></div>}
    </>
  );
}
