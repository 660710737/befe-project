import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../styles/AuthPage.css";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!form.fullName || !form.username || !form.password) {
      setError("กรุณากรอกชื่อ-นามสกุล, ชื่อผู้ใช้ และรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        setError(data.error || "ไม่สามารถสมัครสมาชิกได้");
        setLoading(false);
        return;
      }

      setMsg("สมัครสมาชิกสำเร็จ! ไปหน้าเข้าสู่ระบบได้เลย");
      // หน่วงนิดนึงแล้วเด้งไปหน้า login
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-wrapper">
      <div className="auth-inner">
        <div className="auth-card">
          <h2 className="auth-title">สมัครสมาชิก</h2>
          <p className="auth-subtitle">
            กรอกข้อมูลเพื่อสร้างบัญชีผู้ใช้สำหรับระบบจองหอพักใจ
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              ชื่อ-นามสกุล
              <input
                type="text"
                className="auth-input"
                placeholder="ชื่อ-นามสกุล"
                value={form.fullName}
                onChange={handleChange("fullName")}
              />
            </label>

            <label className="auth-label">
              ชื่อผู้ใช้ (Username)
              <input
                type="text"
                className="auth-input"
                placeholder="Username"
                value={form.username}
                onChange={handleChange("username")}
              />
            </label>

            <label className="auth-label">
              อีเมล
              <input
                type="email"
                className="auth-input"
                placeholder="Email"
                value={form.email}
                onChange={handleChange("email")}
              />
            </label>

            <label className="auth-label">
              เบอร์โทรศัพท์
              <input
                type="tel"
                className="auth-input"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </label>

            <label className="auth-label">
              รหัสผ่าน
              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={form.password}
                onChange={handleChange("password")}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}
            {msg && <p className="auth-success">{msg}</p>}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
            </button>
          </form>

          <p className="auth-footer-text">
            มีบัญชีอยู่แล้ว?{" "}
            <Link to="/login">เข้าสู่ระบบ</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default RegisterPage;