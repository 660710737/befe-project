import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./../styles/AuthPage.css";

function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ให้ browser เก็บ cookie session
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        setError(data.error || "ไม่สามารถเข้าสู่ระบบได้");
        setLoading(false);
        return;
      }

      if (onLogin) {
        onLogin(data.user); // ถ้า App อยากเก็บข้อมูล user
      }

      navigate("/"); // กลับหน้าแรกหลังล็อกอิน
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
          <h2 className="auth-title">เข้าสู่ระบบ</h2>
          <p className="auth-subtitle">กรอกข้อมูลเพื่อเข้าสู่ระบบหอพักใจ</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label className="auth-label">
              ชื่อผู้ใช้
              <input
                type="text"
                className="auth-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="auth-label">
              รหัสผ่าน
              <input
                type="password"
                className="auth-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button
              type="submit"
              className="btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="auth-footer-text">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default LoginPage;
