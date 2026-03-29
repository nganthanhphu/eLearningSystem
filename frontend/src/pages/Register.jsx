import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        dob: "",
        avatar: null,
        confirmpassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const { register, loading } = useAuth();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setForm({
            ...form,
            [name]: files ? files[0] : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(form);
        if (success) {
            window.location.href = "/login";
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-100" style={{ maxWidth: "500px" }}>
                <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white border">
                    <h2 className="text-center mb-4 text-primary">Tạo tài khoản</h2>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-dark">
                            Tên đăng nhập *
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={form.username || ""}
                            onChange={handleChange}
                            required
                            placeholder="Nhập tên đăng nhập"
                            className="form-control"
                        />
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <label htmlFor="first_name" className="form-label text-dark">
                                Họ
                            </label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={form.first_name || ""}
                                onChange={handleChange}
                                placeholder="Nhập họ"
                                className="form-control"
                            />
                        </div>
                        <div className="col">
                            <label htmlFor="last_name" className="form-label text-dark">
                                Tên
                            </label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={form.last_name || ""}
                                onChange={handleChange}
                                placeholder="Nhập tên"
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-dark">
                            Email *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={form.email || ""}
                            onChange={handleChange}
                            required
                            placeholder="Nhập email"
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="dob" className="form-label text-dark">
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={form.dob || ""}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-dark">
                            Mật khẩu *
                        </label>
                        <div className="position-relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={form.password || ""}
                                onChange={handleChange}
                                required
                                placeholder="Nhập mật khẩu"
                                className="form-control"
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="position-absolute top-50 end-0 translate-middle-y cursor-pointer"
                                style={{ cursor: "pointer" }}
                            >
                                {showPassword ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="confirmpassword" className="form-label text-dark">
                            Xác nhận mật khẩu *
                        </label>
                        <div className="position-relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                id="confirmpassword"
                                name="confirmpassword"
                                value={form.confirmpassword || ""}
                                onChange={handleChange}
                                required
                                placeholder="Xác nhận mật khẩu"
                                className="form-control"
                            />
                            <span
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="position-absolute top-50 end-0 translate-middle-y cursor-pointer"
                                style={{ cursor: "pointer" }}
                            >
                                {showConfirm ? <FiEyeOff /> : <FiEye />}
                            </span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label text-dark">
                            Hình đại diện *
                        </label>
                        <input
                            type="file"
                            id="avatar"
                            name="avatar"
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đăng ký"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;