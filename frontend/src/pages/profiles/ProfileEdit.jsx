import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useProfile } from "../../hooks/useProfile";
import { toast } from "react-toastify";

export default function ProfileEdit() {
  const [cookies] = useCookies(["user_info"]);
  const { updateProfile, loading } = useProfile();
  const [avatarReview, setavatarReview] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (cookies.user_info) {
      const userInfo =
        typeof cookies.user_info === "string"
          ? JSON.parse(cookies.user_info)
          : cookies.user_info;
      setFormData({
        first_name: userInfo.first_name || "",
        last_name: userInfo.last_name || "",
        email: userInfo.email || "",
        avatar: userInfo.avatar || "",
      });
    }
  }, [cookies.user_info]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file hình ảnh!");
        return;
      }
      setFormData((prev) => ({ ...prev, avatar: file }));
      TransformFile(file);
    }
  };

  const TransformFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setavatarReview(reader.result);
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await updateProfile(formData);
    if (result.success) {
      toast.success("Cập nhật thông tin thành công!");
      setavatarReview(null);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <h4 className="mb-4 fw-bold">Thông tin cá nhân</h4>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label fw-medium text-secondary">Họ</label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mt-3 mt-md-0">
            <label className="form-label fw-medium text-secondary">Tên</label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium text-secondary">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium text-secondary">
            Ảnh đại diện
          </label>
          <input
            type="file"
            accept="image/*"
            className="form-control mb-2"
            onChange={handleFileChange}
            title="Chọn ảnh từ máy"
          />
          {avatarReview && (
            <div className="mt-3">
              <img
                src={avatarReview}
                alt="Avatar Preview"
                className="rounded-circle shadow-sm"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary px-4 fw-bold"
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </form>
    </div>
  );
}
