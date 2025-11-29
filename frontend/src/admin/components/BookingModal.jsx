import React, { useState, useEffect } from "react";
import "../styles/BookingComponents.css";

const BookingModal = ({
  type,
  booking,
  contractDate,     // 👈 รับ Props
  setContractDate,  // 👈 รับ Props
  rejectReason,
  setRejectReason,
  onClose,
  onApprove,
  onReject,
}) => {
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (booking) setActiveTab(1);
  }, [booking]);

  if (!type || !booking) return null;
  const stop = (e) => e.stopPropagation();

  // --- Detail Modal (เหมือนเดิม) ---
  if (type === "detail") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={stop}>
          <div className="modal-header">
            <div className="modal-title">รายละเอียดการจอง #{booking.id}</div>
          </div>

          <div className="modal-body">
            <div className="modal-row-group">
               <div className="modal-row">
                <label>อาคาร</label>
                <input className="modal-input" value={booking.building} readOnly />
              </div>
              <div className="modal-row">
                <label>จำนวนคน</label>
                <input className="modal-input" value={booking.people} readOnly />
              </div>
              <div className="modal-row">
                <label>วันที่เข้าพัก</label>
                <input className="modal-input" value={booking.checkinDate} readOnly />
              </div>
            </div>
            <hr className="modal-divider" />
            {booking.people === 2 && (
              <div className="modal-tabs">
                <button className={`tab-btn ${activeTab === 1 ? "active" : ""}`} onClick={() => setActiveTab(1)}>ผู้เช่าหลัก (1)</button>
                <button className={`tab-btn ${activeTab === 2 ? "active" : ""}`} onClick={() => setActiveTab(2)}>รูมเมท (2)</button>
              </div>
            )}
            <div className="modal-person-info">
              <div className="modal-row">
                <label>ชื่อผู้จอง {booking.people === 2 ? `(คนที่ ${activeTab})` : ""}</label>
                <input className="modal-input" value={activeTab === 1 ? booking.rawGuest1 : booking.rawGuest2} readOnly />
              </div>
              <div className="modal-row">
                <label>เบอร์โทร</label>
                <input className="modal-input" value={activeTab === 1 ? booking.phone1 : booking.phone2} readOnly />
              </div>
              <div className="modal-row">
                <label>อีเมล</label>
                <input className="modal-input" value={activeTab === 1 ? booking.email1 : booking.email2} readOnly />
              </div>
            </div>
          </div>
          <div className="modal-footer center">
            <button className="btn-simple" onClick={onClose}>ปิด</button>
          </div>
        </div>
      </div>
    );
  }

  // --- Approve Modal (เปลี่ยน Input เป็น Date) ---
  if (type === "approve") {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={stop}>
          <div className="modal-header">
            <div className="modal-title">อนุมัติการจอง #{booking.id}</div>
          </div>

          <div className="modal-body">
            <div className="modal-row">
              <label>วันที่ทำสัญญา</label>
              <input 
                  type="date" 
                  className="modal-input" 
                  value={contractDate} 
                  onChange={(e) => setContractDate(e.target.value)}
                  required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn-simple" onClick={onClose}>ยกเลิก</button>
            <button 
              className="btn-primary" 
              onClick={onApprove}
              disabled={!contractDate} // ห้ามกดถ้าไม่เลือกวันที่
              style={{ opacity: !contractDate ? 0.5 : 1 }}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Reject Modal (เหมือนเดิม) ---
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={stop}>
        <div className="modal-header">
          <div className="modal-title">ปฏิเสธการจอง #{booking.id}</div>
        </div>
        <div className="modal-body">
          <div className="modal-row">
            <label>เหตุผลการปฏิเสธ</label>
            <textarea 
                className="modal-textarea"
                placeholder="กรุณากรอกเหตุผล"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-simple" onClick={onClose}>ยกเลิก</button>
          <button className="btn-danger" onClick={onReject}>ยืนยันการปฏิเสธ</button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;