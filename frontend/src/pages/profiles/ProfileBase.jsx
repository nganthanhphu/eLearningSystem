import { Outlet, NavLink } from "react-router-dom";

export default function ProfileBase() {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 mb-4">
          <div className="list-group">
            <NavLink
              to="/profile/me/edit"
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${
                  isActive ? "active" : ""
                }`
              }
            >
              Thông tin cá nhân
            </NavLink>
            <NavLink
              to="/profile/me/security"
              className={({ isActive }) =>
                `list-group-item list-group-item-action ${
                  isActive ? "active" : ""
                }`
              }
            >
              Bảo mật tài khoản
            </NavLink>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
