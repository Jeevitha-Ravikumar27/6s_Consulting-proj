import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const navigate = useNavigate();
  const { loginUser, adminLogin, botLogin, user } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("applicant"); 

  if (user) {
    
    if (user.role === "applicant") navigate("/dashboard");
    else if (user.role === "admin") navigate("/admin/dashboard");
    else if (user.role === "bot") navigate("/bot/dashboard");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (role === "applicant") await loginUser(form.email, form.password);
      else if (role === "admin") await adminLogin(form.email, form.password);
      else if (role === "bot") await botLogin(form.email, form.password);

      toast.success(
        `${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`
      );

     
      if (role === "applicant") navigate("/dashboard");
      else if (role === "admin") navigate("/admin/dashboard");
      else navigate("/bot/dashboard");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4"
        style={{ minWidth: "300px", maxWidth: "400px" }}
      >
        <h2 className="mb-3 text-center">Login</h2>

        {/* Role Selection */}
        <div className="mb-3 text-center">
          <label className="me-2">Login as:</label>
          <select
            className="form-select d-inline-block w-auto"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="applicant">Applicant</option>
            <option value="admin">Admin</option>
            <option value="bot">Bot</option>
          </select>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">
            Login
          </button>
        </form>

        <p className="mt-3 text-center text-muted">
          Select your role above to login accordingly.
        </p>
      </div>
    </div>
  );
}
