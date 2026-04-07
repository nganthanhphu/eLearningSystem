import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { ROLES } from "../config/roles";

export default function Header() {
  const navigate = useNavigate();
  const [cookies, , removeCookie] = useCookies(["access_token", "user_info"]);

  const userInfo = (() => {
    if (!cookies.user_info) {
      return null;
    }

    try {
      return typeof cookies.user_info === "string"
        ? JSON.parse(cookies.user_info)
        : cookies.user_info;
    } catch (error) {
      console.error("Invalid user info format in cookies", error);
      return null;
    }
  })();

  const isLoggedIn = Boolean(cookies.access_token);

  const isStudent = userInfo?.role === ROLES.STUDENT;
  const isTeacher = userInfo?.role === ROLES.TEACHER;

  const handleLogout = () => {
    removeCookie("access_token", { path: "/" });
    removeCookie("user_info", { path: "/" });
    navigate("/login");
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary px-3 py-2">
        <div className="container-fluid">
          <a
            href="/"
            className="navbar-brand d-flex align-items-center gap-2 fw-bold fs-5"
          >
            E-Learning System
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto ms-4 align-items-center gap-3">
              <li className="nav-item">
                <button
                  className="nav-link fw-medium fs-6 text-light"
                  onClick={() => navigate("/courses")}
                >
                  Khóa học
                </button>
              </li>
              {isLoggedIn && isStudent && (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link fw-medium fs-6 text-light"
                      onClick={() => navigate("/student/enrollments")}
                    >
                      Khóa học của tôi
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link fw-medium fs-6 text-light"
                      onClick={() => navigate("/student/submissions")}
                    >
                      Danh sách bài đã nộp
                    </button>
                  </li>
                </>
              )}
              {isLoggedIn && isTeacher && (
                <li className="nav-item">
                  <button
                    className="nav-link fw-medium fs-6 text-light"
                    onClick={() => navigate("/teacher/submissions")}
                  >
                    Danh sách bài của học sinh
                  </button>
                </li>
              )}
            </ul>
            <ul className="navbar-nav ms-auto align-items-center gap-3">
              {isLoggedIn ? (
                <>
                  {userInfo && (
                    <li
                      className="nav-item d-flex align-items-center gap-2"
                      onClick={() => navigate("/profile")}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={userInfo.avatar}
                        alt="User Avatar"
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <span className="text-light fw-medium">
                        {userInfo.last_name} {userInfo.first_name}
                      </span>
                    </li>
                  )}
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light"
                      onClick={handleLogout}
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button
                      className="btn btn-primary ms-2"
                      onClick={() => navigate("/login")}
                    >
                      Đăng nhập
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light ms-2"
                      onClick={() => navigate("/register")}
                    >
                      Đăng ký
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
