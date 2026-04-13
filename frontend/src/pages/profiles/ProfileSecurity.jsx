import React, { useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { toast } from "react-toastify";

export default function ProfileSecurity() {
  const { updatePassword, loading } = useProfile();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin để đổi mật khẩu");
      return false;
    }
    
    if(formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }
    return true;

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const payload = {};
      if (formData.newPassword) {
        payload.old_password = formData.currentPassword;
        payload.password = formData.newPassword;
      }

      const result = await updatePassword(payload);
      if (result.success) {
        toast.success("Cập nhật thông tin bảo mật thành công!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <div>
      <h4 className="mb-4 fw-bold">Bảo mật tài khoản</h4>
      <form onSubmit={handleSubmit}>
        <h5 className="mb-3 fw-medium">Đổi mật khẩu</h5>

        <div className="mb-3">
          <label className="form-label fw-medium text-secondary">Mật khẩu hiện tại</label>
          <input
            type="password"
            name="currentPassword"
            className={`form-control `}
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium text-secondary">Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            className={`form-control `}
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label className="form-label fw-medium text-secondary">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            name="confirmPassword"
            className={`form-control `}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary px-4 fw-bold" disabled={loading}>
          {loading ? "Đang xử lý..." : "Cập nhật bảo mật"}
        </button>
      </form>
    </div>
  );
}
