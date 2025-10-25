// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          JobPortal
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {role === "applicant" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/jobs")}`} to="/jobs">
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/my-applications")}`} to="/my-applications">
                    My Applications
                  </Link>
                </li>
              </>
            )}

            {role === "admin" && (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/dashboard")}`} to="/admin/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/jobs")}`} to="/admin/jobs">
                    Jobs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/admin/applications")}`} to="/admin/applications">
                    Applications
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item">
              <Link className="nav-link text-warning" to="/login" onClick={handleLogout}>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
