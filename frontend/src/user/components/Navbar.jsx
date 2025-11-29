import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./../styles/Navbar.css";

function Navbar({ isLoggedIn, onLogout }) {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <header className="navbar-wrapper">
      <div className="navbar-top">
        <div className="navbar-inner">
          {/* โลโก้ */}
          <Link to="/" className="navbar-logo">
            หอพักใจ
          </Link>

          {/* เมนูกลาง – โชว์เฉพาะตอน login แล้ว */}
          <nav className="navbar-menu">
            {isLoggedIn && (
              <>
                <Link to="/" className="nav-link">
                  หน้าแรก
                </Link>
                <Link to="/rooms" className="nav-link">
                  จองห้องพัก
                </Link>
                <Link to="/profile" className="nav-link">
                  โปรไฟล์
                </Link>
              </>
            )}
          </nav>

          {/* ปุ่มด้านขวา – แยกตามหน้า */}
          <div className="navbar-actions">
            {!isLoggedIn && (
              <>
                {isLoginPage && (
                  // หน้า Login → มีปุ่มส้ม "สมัครสมาชิก" อย่างเดียว
                  <Link to="/register">
                    <button className="btn-primary">
                      สมัครสมาชิก
                    </button>
                  </Link>
                )}

                {isRegisterPage && (
                  // หน้า Register → เป็นลิงก์ตัวหนังสือ "หน้าแรก เข้าสู่ระบบ"
                  <>
                    <Link to="/" className="nav-link auth-nav-link">
                      หน้าแรก
                    </Link>
                    <Link to="/login" className="nav-link auth-nav-link">
                      เข้าสู่ระบบ
                    </Link>
                  </>
                )}

                {!isLoginPage && !isRegisterPage && (
                  // หน้าอื่นตอนยังไม่ล็อกอิน → ปุ่มเดิม 2 อัน
                  <>
                    <Link to="/login">
                      <button className="btn-outline">เข้าสู่ระบบ</button>
                    </Link>
                    <Link to="/register">
                      <button className="btn-primary">สมัครสมาชิก</button>
                    </Link>
                  </>
                )}
              </>
            )}

            {isLoggedIn && (
              <button className="btn-outline" onClick={onLogout}>
                ออกจากระบบ
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
