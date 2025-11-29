import React, { useEffect, useMemo, useState } from "react";
import Sidebar from "../components/Sidebar";
import BookingFilters from "../components/BookingFilters";
import BookingTable from "../components/BookingTable";
import BookingModal from "../components/BookingModal";
import "../styles/BookingPage.css";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filter States
  const [searchText, setSearchText] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  // Modal States
  const [modalType, setModalType] = useState(null); 
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // State สำหรับวันที่สัญญา (แทน approveNote เดิม)
  const [contractDate, setContractDate] = useState(""); 
  const [rejectReason, setRejectReason] = useState("");

  // 1. Fetch Data
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/admin/bookings");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      const normalized = (data || []).map((b) => {
        let displayName = b.guest1Name || `User ${b.userId}`;
        if (b.people === 2 && b.guest2Name) {
          displayName = `${b.guest1Name}, ${b.guest2Name}`;
        }

        return {
          id: b.id,
          name: displayName,
          building: b.building,
          people: b.people,
          checkinDate: formatDate(b.moveInDate),
          status: mapStatus(b.status),
          
          rawGuest1: b.guest1Name || "-",
          phone1: b.guest1Phone || "-",
          email1: b.guest1Email || "-",

          rawGuest2: b.guest2Name || "-",
          phone2: b.guest2Phone || "-",
          email2: b.guest2Email || "-",
          
          line: "-",
        };
      });

      setBookings(normalized);
      setError("");
    } catch (err) {
      console.error(err);
      setError("โหลดข้อมูลไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("th-TH", {
      year: 'numeric', month: '2-digit', day: '2-digit'
    });
  };

  const mapStatus = (status) => {
    if (status === "รอตรวจสอบ" || status === "pending") return "pending";
    if (status === "อนุมัติแล้ว" || status === "approved") return "approved";
    if (status === "ปฏิเสธ" || status === "rejected") return "rejected";
    return status;
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const q = searchText.toLowerCase();
      const matchText =
        String(b.id).includes(q) ||
        b.rawGuest1.toLowerCase().includes(q) ||
        b.rawGuest2.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q);

      const matchBuilding =
        buildingFilter === "ทั้งหมด" || b.building === buildingFilter;

      const matchStatus =
        statusFilter === "ทั้งหมด" || b.status === statusFilter;

      return matchText && matchBuilding && matchStatus;
    });
  }, [bookings, searchText, buildingFilter, statusFilter]);

  const handleOpenDetail = (b) => { setSelectedBooking(b); setModalType("detail"); };
  const handleOpenApprove = (b) => { setSelectedBooking(b); setModalType("approve"); };
  const handleOpenReject = (b) => { setSelectedBooking(b); setModalType("reject"); };
  
  const handleCloseModal = () => {
    setModalType(null);
    setSelectedBooking(null);
    setContractDate(""); // Reset วันที่
    setRejectReason("");
  };

  const submitStatusUpdate = async (newStatus) => {
    if (!selectedBooking) return;
    try {
      const res = await fetch("http://localhost:8080/api/admin/bookings/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            id: selectedBooking.id, 
            status: newStatus,
            contractDate: contractDate // ส่งวันที่ไปด้วย
        }),
      });
      if (res.ok) {
        alert("ทำรายการสำเร็จ");
        handleCloseModal();
        fetchBookings(); 
      } else {
        alert("เกิดข้อผิดพลาด");
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main admin-booking-page">
        <h1 className="booking-page-title" style={{textAlign:'left', marginLeft:'20px'}}>การจอง</h1>

        <BookingFilters
          searchText={searchText}
          setSearchText={setSearchText}
          buildingFilter={buildingFilter}
          setBuildingFilter={setBuildingFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {loading && <p style={{color:'white', padding:20}}>กำลังโหลด...</p>}
        {error && <p style={{color:'red', padding:20}}>{error}</p>}

        {!loading && !error && (
          <BookingTable
            bookings={filteredBookings}
            onDetail={handleOpenDetail}
            onApprove={handleOpenApprove}
            onReject={handleOpenReject}
          />
        )}

        <BookingModal
          type={modalType}
          booking={selectedBooking}
          
          contractDate={contractDate}        // ส่ง Props ใหม่
          setContractDate={setContractDate}  // ส่ง Props ใหม่
          
          rejectReason={rejectReason}
          setRejectReason={setRejectReason}
          onClose={handleCloseModal}
          onApprove={() => submitStatusUpdate("approved")}
          onReject={() => submitStatusUpdate("rejected")}
        />
      </div>
    </div>
  );
};

export default BookingPage;