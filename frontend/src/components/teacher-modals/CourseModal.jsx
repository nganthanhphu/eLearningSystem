import React, { useEffect, useState } from "react";

export default function CourseModal({
  show,
  handleClose,
  handleSave,
  initialData,
}) {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (initialData) {
      setCourseData({
        title: initialData.title || "",
        description: initialData.description || "",
      });
    } else {
      setCourseData({ title: "", description: "" });
    }
  }, [initialData, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!courseData.title.trim()) return;
    handleSave(courseData);
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
                {initialData ? "Sửa khóa học" : "Thêm khóa học mới"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={onSubmit} id="courseForm">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Tên khóa học <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={courseData.title}
                    onChange={handleChange}
                    placeholder="Nhập tên khóa học"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Mô tả <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows={4}
                    value={courseData.description}
                    onChange={handleChange}
                    placeholder="Nhập mô tả khóa học"
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
                form="courseForm"
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
