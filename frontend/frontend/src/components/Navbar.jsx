import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser, userLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  if (userLoading) return <div className="text-center py-3">Loading...</div>;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top w-100">
      <div className="container-fluid px-4 d-flex justify-content-between align-items-center flex-wrap">
        <Link
          className="navbar-brand fw-bold text-primary"
          to={user ? "/dashboard" : "/"}
        >
          Job Portal
        </Link>

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

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav align-items-center">
            {!user && (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link text-dark" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary btn-sm" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {user && (
              <>
                {user.role?.toLowerCase() === "applicant" && (
                  <>
                    <li className="nav-item me-2">
                      <Link className="nav-link text-dark" to="/dashboard">
                        My Applications
                      </Link>
                    </li>
                    <li className="nav-item me-2">
                      <Link className="nav-link text-dark" to="/jobs">
                        Jobs
                      </Link>
                    </li>
                  </>
                )}
                {user.role?.toLowerCase() === "admin" && (
                  <li className="nav-item me-2">
                    <Link className="nav-link text-dark" to="/admin/dashboard">
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                {user.role?.toLowerCase() === "admin" && (
                  <li className="nav-item me-2">
                    <Link className="nav-link text-dark" to="/jobs">
                      Jobs
                    </Link>
                  </li>
                )}
                {user.role?.toLowerCase() === "bot" && (
                  <li className="nav-item me-2">
                    <Link className="nav-link text-dark" to="/bot">
                      Bot Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
