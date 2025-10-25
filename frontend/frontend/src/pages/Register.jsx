import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "applicant" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/register", form);
      alert("Registration successful!");
      console.log(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card">
        <h2>Create Your Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Full Name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email Address"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control" placeholder="Password"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="mb-3">
            <select className="form-select"
              value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="applicant">Applicant</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Register</button>
        </form>
        <p className="mt-3 text-center text-muted">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

