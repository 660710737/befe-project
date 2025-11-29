import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoomsPage.css";
import RoomAvailability from "../components/RoomAvailability"; // ✅ 1. Import Component

function RoomsPage() {
  const navigate = useNavigate();
  const [building, setBuilding] = useState("A");
  const [moveInDate, setMoveInDate] = useState("");
  const [numPeople, setNumPeople] = useState(1);

  // ข้อมูลผู้ใช้ที่ดึงจาก /api/profile
  const [user, setUser] = useState({
    fullName: "กำลังโหลด...",
    phone: "",
    email: "",
  });

  const [guest2, setGuest2] = useState({
    fullName: "",
    phone: "",
    email: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [bookingSummary, setBookingSummary] = useState(null);

  // ดึง profile จาก backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/profile", {
          method: "GET",
          credentials: "include", // ส่ง cookie session ไปด้วย
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser({ fullName: "กรุณาเข้าสู่ระบบ", phone: "-", email: "-" });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!moveInDate) {
      alert("กรุณาเลือกวันที่เข้าพัก");
      return;
    }

    if (numPeople === 2) {
      if (!guest2.fullName || !guest2.phone || !guest2.email) {
        alert("กรุณากรอกข้อมูลผู้เข้าพักคนที่ 2 ให้ครบ");
        return;
      }
    }

    const summary = {
      building,
      moveInDate,
      numPeople,
      guest1: user,
      guest2: numPeople === 2 ? guest2 : null,
    };
    setBookingSummary(summary);
    setShowConfirm(true);
  };

  // ✅ ฟังก์ชันนี้คือส่วนที่ยิงไปบันทึกลง DB
  const handleConfirmBooking = async () => {
    if (!bookingSummary) return;

    // เตรียม payload ให้ตรงกับ backend (createBookingRequest)
    const payload = {
      building: bookingSummary.building,
      people: Number(bookingSummary.numPeople),
      moveInDate: bookingSummary.moveInDate,

      // Guest 1 = เจ้าของ account
      guest1Name: bookingSummary.guest1?.fullName || "",
      guest1Phone: bookingSummary.guest1?.phone || "",
      guest1Email: bookingSummary.guest1?.email || "",

      // Guest 2 ถ้ามี
      guest2Name:
        bookingSummary.numPeople === 2 ? bookingSummary.guest2.fullName : "",
      guest2Phone:
        bookingSummary.numPeople === 2 ? bookingSummary.guest2.phone : "",
      guest2Email:
        bookingSummary.numPeople === 2 ? bookingSummary.guest2.email : "",
    };

    try {
      const res = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // เพื่อให้ backend รู้ว่า user คนไหนจอง
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("Create booking failed:", res.status, data);
        alert(data.error || "เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่");
        return;
      }

      console.log("Booking created:", data);
      setShowConfirm(false);
      setBookingDone(true);
    } catch (err) {
      console.error("Error booking:", err);
      alert("ไม่สามารถเชื่อมต่อ Server ได้");
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirm(false);
  };

  const handleGuest2Change = (field, value) => {
    setGuest2((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateThai = (value) => {
    if (!value) return "xx/xx/xxxx";
    const [y, m, d] = value.split("-");
    return `${d}/${m}/${y}`;
  };

  return (
    <main className="rooms-wrapper">
      <div className="rooms-container">
        <h1 className="rooms-title">จองห้องพัก</h1>

        {!bookingDone ? (
          <>
            {/* การ์ดข้อมูลห้องพัก */}
            <h2 className="rooms-card-title">ข้อมูลห้องพัก</h2>
            <section className="rooms-section">
              <div className="rooms-card rooms-roominfo-card">
                <div className="rooms-roomtype-box">
                  <p className="rooms-roomtype-name">ห้องพักมาตรฐาน</p>
                  <p>ขนาด 20 ตร.ม.</p>
                  <p className="rooms-roomtype-price">
                    45,000 บาท/ปี
                    <br />
                    <span>ไม่รวมค่าไฟ ค่าน้ำ</span>
                  </p>
                </div>
              </div>
            </section>

            {/* ตารางจำนวนห้องว่าง */}
            <section className="rooms-section">
              <div className="rooms-card">
                <h3 className="rooms-card-subtitle">จำนวนห้องว่าง</h3>
                
                {/* ✅ 2. แทนที่ตารางเดิมด้วย Component นี้ */}
                <RoomAvailability />
                
              </div>
            </section>

            {/* ฟอร์มจอง */}
            <form className="rooms-form" onSubmit={handleSubmit}>
              <div className="rooms-card rooms-form-card">
                <label className="rooms-label">เลือกอาคาร</label>
                <select
                  className="rooms-input"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </div>

              <div className="rooms-card rooms-form-card">
                <label className="rooms-label">วันที่เข้าพัก</label>
                <input
                  type="date"
                  className="rooms-input"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                />
              </div>

              <div className="rooms-card rooms-form-card">
                <label className="rooms-label">จำนวนผู้เข้าพัก</label>
                <select
                  className="rooms-input"
                  value={numPeople}
                  onChange={(e) => setNumPeople(Number(e.target.value))}
                >
                  <option value={1}>1 คน</option>
                  <option value={2}>2 คน</option>
                </select>
              </div>

              <div className="rooms-card rooms-form-card">
                <div className="rooms-label">ข้อมูลผู้เข้าพักคนที่ 1</div>
                <input
                  className="rooms-input rooms-input-readonly"
                  value={user.fullName}
                  disabled
                />
                <input
                  className="rooms-input rooms-input-readonly"
                  value={user.phone}
                  disabled
                />
                <input
                  className="rooms-input rooms-input-readonly"
                  value={user.email}
                  disabled
                />
              </div>

              {numPeople === 2 && (
                <div className="rooms-card rooms-form-card">
                  <div className="rooms-label">ข้อมูลผู้เข้าพักคนที่ 2</div>
                  <input
                    className="rooms-input"
                    placeholder="ชื่อ-นามสกุล"
                    value={guest2.fullName}
                    onChange={(e) =>
                      handleGuest2Change("fullName", e.target.value)
                    }
                  />
                  <input
                    className="rooms-input"
                    placeholder="เบอร์โทรศัพท์"
                    value={guest2.phone}
                    onChange={(e) =>
                      handleGuest2Change("phone", e.target.value)
                    }
                  />
                  <input
                    className="rooms-input"
                    placeholder="อีเมล"
                    value={guest2.email}
                    onChange={(e) =>
                      handleGuest2Change("email", e.target.value)
                    }
                  />
                </div>
              )}

              <button type="submit" className="rooms-submit-btn">
                ยืนยันการจอง
              </button>
            </form>
          </>
        ) : (
          <section className="rooms-success">
            <div className="rooms-success-icon-wrapper">
              <div className="rooms-success-icon">✓</div>
            </div>
            <h2 className="rooms-success-title">
              จองสำเร็จ! ขอบคุณที่เลือกใช้บริการหอพักใจ
            </h2>

            <div className="success-box">
              <h3 className="success-box-title">ห้องของคุณ</h3>
              <p className="success-box-desc">
                เจ้าหน้าที่จะกำหนดเลขห้องให้ในวันทำสัญญา
              </p>
            </div>

            <div className="rooms-card rooms-next-steps-card">
              <h2 className="rooms-card-subtitle">ขั้นตอนต่อไป: การทำสัญญา</h2>
              <div className="rooms-next-steps-grid">
                <div className="rooms-next-step-box step-purple">
                  <h4>เอกสารที่ต้องเตรียม</h4>
                  <ul>
                    <li>
                      <strong>สำเนาบัตรประชาชนผู้พัก </strong>(จำนวน 2 ฉบับ)
                    </li>
                    <li>
                      <strong>สำเนาบัตรประชาชนผู้ปกครอง </strong>(จำนวน 2
                      ฉบับ)
                    </li>
                    <li>
                      <strong>สำเนาทะเบียนบ้านผู้พัก </strong>(จำนวน 1 ฉบับ)
                    </li>
                  </ul>
                </div>

                <div className="rooms-next-step-box step-green">
                  <h4>เงินที่ต้องชำระในวันทำสัญญา</h4>
                  <ul>
                    <li>ค่าประกันห้อง 3,000 บาท (ครั้งเดียว)</li>
                    <li>ค่าเช่าล่วงหน้า 1 เดือน 3,000 บาท</li>
                    <li>รวมทั้งสิ้น 6,000 บาท</li>
                  </ul>
                </div>

                <div className="rooms-next-step-box step-yellow">
                  <h4>สถานที่ทำสัญญา</h4>
                  <ul>
                    <li>ชั้น 1 ห้องพักใจ</li>
                    <li>เวลาทำการ 09.00–18.00 น.</li>
                    <li>สอบถามเพิ่มเติม โทร 02-232-2323</li>
                  </ul>
                </div>

                <div className="rooms-next-step-box step-pink">
                  <h4>หมายเหตุสำคัญ</h4>
                  <ul>
                    <li>
                      กรุณานำเอกสารตัวจริงมาในวันทำสัญญาด้วยทุกครั้ง
                    </li>
                    <li>
                      การจองมีอายุ 7 วัน หากไม่มาทำสัญญาจะถือว่าสละสิทธิ์
                    </li>
                    <li>หลังทำสัญญาไม่สามารถคืนเงินจองได้</li>
                    <li>
                      <p className="text-red">
                        หากไม่มาทำสัญญาตามกำหนด ระบบจะยกเลิกการจองโดยอัตโนมัติ
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary rooms-history-btn"
              onClick={() => navigate("/profile")}
            >
              ประวัติการจอง
            </button>
          </section>
        )}
      </div>

      {/* Modal ยืนยันการจอง */}
      {showConfirm && bookingSummary && (
        <div className="rooms-modal-backdrop">
          <div className="rooms-modal">
            <h3 className="rooms-modal-title">ตรวจสอบความถูกต้อง</h3>
            <div className="rooms-modal-body">
              <p>
                <strong>อาคาร : </strong>
                {bookingSummary.building}
              </p>
              <p>
                <strong>วันที่เข้าพัก : </strong>
                {formatDateThai(bookingSummary.moveInDate)}
              </p>
              <p>
                <strong>จำนวน : </strong>
                {bookingSummary.numPeople} คน
              </p>
              <p>
                <strong>ผู้เข้าพักคนที่ 1 : </strong>
                {bookingSummary.guest1.fullName}
              </p>
              <p>
                <strong>เบอร์โทร : </strong>
                {bookingSummary.guest1.phone}
              </p>
              <p>
                <strong>อีเมล : </strong>
                {bookingSummary.guest1.email}
              </p>
              {bookingSummary.guest2 && (
                <p>
                  <strong>ผู้เข้าพักคนที่ 2 : </strong>
                  {bookingSummary.guest2.fullName}
                  <br />
                  <strong>เบอร์โทร : </strong>
                  {bookingSummary.guest2.phone}
                  <br />
                  <strong>อีเมล : </strong>
                  {bookingSummary.guest2.email}
                </p>
              )}
              <p className="rooms-modal-note">
                <strong>หมายเหตุ:</strong> เลขห้องจะถูกกำหนดและแจ้งให้ทราบในวันทำสัญญา
              </p>
            </div>
            <div className="rooms-modal-actions">
              <button
                type="button"
                className="rooms-modal-btn rooms-modal-btn-secondary"
                onClick={handleCancelConfirm}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="rooms-modal-btn rooms-modal-btn-primary"
                onClick={handleConfirmBooking}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default RoomsPage;