import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const { login, loading } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            alert("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        const success = await login(form);

        if (success) {
            window.location.href = "/";
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="w-100" style={{ maxWidth: "500px" }}>
                <form onSubmit={handleSubmit} className="p-4 rounded shadow bg-white border">
                    <h2 className="text-center mb-4 text-primary">Đăng nhập</h2>

                    <div className="mb-3">
                        <label htmlFor="username" className="form-label text-dark">
                            Tên đăng nhập
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

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-dark">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={form.password || ""}
                            onChange={handleChange}
                            required
                            placeholder="Nhập mật khẩu"
                            className="form-control"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-100 mt-3"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>

                    <p className="text-center mt-3 text-secondary">
                        Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;