import React, { useState, useEffect, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import ContractFilters from "../components/ContractFilters";
import ContractTable from "../components/ContractTable";
import ContractModal from "../components/ContractModal"; // ใช้ Modal เดิมที่มีช่องใส่เลขห้องอยู่แล้ว
import "../styles/ContractsPage.css";

const ContractsPage = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchText, setSearchText] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("ทั้งหมด");
  const [statusFilter, setStatusFilter] = useState("ทั้งหมด");

  // Modal State
  const [selected, setSelected] = useState(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Fetch Data
  const fetchContracts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/admin/contracts");
      const data = await res.json();
      
      // Map ข้อมูลให้ตรงกับ Table
      const normalized = (data || []).map(c => ({
        id: c.id,
        name: c.name,
        building: c.building,
        checkinDate: formatDate(c.moveInDate),
        contractDate: formatDate(c.contractDate),
        
        // Logic สถานะ: ถ้าเป็น contract_signed ให้เป็น 'done', นอกนั้น 'waiting'
        status: c.status === "contract_signed" ? "done" : "waiting",
        
        room: c.roomNumber || "-"
      }));

      setContracts(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const formatDate = (d) => {
    if(!d || d === "") return "-";
    return new Date(d).toLocaleDateString("th-TH");
  }

  // 2. Filter Logic
  const filteredContracts = useMemo(() => {
    const kw = searchText.toLowerCase();
    return contracts.filter((c) => {
      const matchText = c.name.toLowerCase().includes(kw) || String(c.id).includes(kw);
      const matchBuilding = buildingFilter === "ทั้งหมด" || c.building === buildingFilter;
      const matchStatus = statusFilter === "ทั้งหมด" || c.status === statusFilter; // waiting, done
      return matchText && matchBuilding && matchStatus;
    });
  }, [contracts, searchText, buildingFilter, statusFilter]);

  // 3. Open Modal
  const openModal = (contract) => {
    // ถ้าสถานะเสร็จสิ้นแล้ว (done) อาจจะกดไม่ได้ หรือกดแล้วแค่ดูข้อมูล
    // แต่ถ้าอยากให้แก้ได้ตลอดก็เปิดได้เลย
    setSelected(contract);
    setRoomNumber(contract.room !== "-" ? contract.room : ""); 
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelected(null);
    setRoomNumber("");
  };

  // 4. Confirm Action (บันทึกเลขห้อง + เปลี่ยนสถานะ)
  const handleConfirm = async () => {
    if (!selected) return;

    try {
      const res = await fetch("http://localhost:8080/api/admin/contracts/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           id: selected.id,
           roomNumber: roomNumber // ส่งเลขห้องไป
        })
      });

      if(res.ok) {
        alert("ทำสัญญาสำเร็จ และบันทึกเลขห้องเรียบร้อย");
        closeModal();
        fetchContracts(); // โหลดข้อมูลใหม่
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch(err) {
      alert("เชื่อมต่อ Server ไม่ได้");
    }
  };

  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main admin-contracts-page">
        <h1 className="contracts-page-title">การทำสัญญา</h1>

        <ContractFilters
          searchText={searchText}
          setSearchText={setSearchText}
          buildingFilter={buildingFilter}
          setBuildingFilter={setBuildingFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {loading ? (
            <p style={{color:'white', padding:20}}>กำลังโหลด...</p>
        ) : (
            <ContractTable contracts={filteredContracts} onOpenModal={openModal} />
        )}

        <ContractModal
          isOpen={isModalOpen}
          contract={selected}
          roomNumber={roomNumber}
          setRoomNumber={setRoomNumber}
          onClose={closeModal}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};

export default ContractsPage;