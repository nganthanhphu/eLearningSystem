import React, { useEffect, useState } from "react";

export default function LessonModal({
  show,
  handleClose,
  handleSave,
  initialData,
}) {
  const [lessonData, setLessonData] = useState({
    title: "",
    content: "",
    video_url: "",
  });

  useEffect(() => {
    if (initialData) {
      setLessonData({
        title: initialData.title || "",
        content: initialData.content || "",
        video_url: initialData.video_url || "",
      });
    } else {
      setLessonData({ title: "", content: "", video_url: "" });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!lessonData.title.trim()) return;
    handleSave(lessonData);
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
                {initialData ? "Sửa bài học" : "Thêm bài học mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit} id="lessonForm">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tên bài học <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={lessonData.title}
                    onChange={handleChange}
                    placeholder="Nhập tên bài học"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">URL Video <span className="text-danger">*</span></label>
                  <input
                    type="url"
                    name="video_url"
                    className="form-control"
                    value={lessonData.video_url}
                    onChange={handleChange}
                    placeholder="Nhập liên kết video bài giảng"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nội dung / Mô tả <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="content"
                    className="form-control"
                    rows={4}
                    value={lessonData.content}
                    onChange={handleChange}
                    placeholder="Nhập nội dung bài học"
                    required
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
                form="lessonForm"
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
