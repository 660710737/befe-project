import React from "react";
import "../styles/ContractsComponents.css";

const ContractModal = ({
  isOpen,
  contract,
  roomNumber,
  setRoomNumber,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !contract) return null;

  const stop = (e) => e.stopPropagation();

  return (
    <div className="contract-modal-overlay" onClick={onClose}>
      <div className="contract-modal-card" onClick={stop}>
        <div className="contract-modal-header">
          <div className="contract-modal-title">ยืนยันการทำสัญญา</div>
        </div>

        <div className="contract-modal-body">
          <div className="contract-modal-row">
            <label>ผู้จอง</label>
            <input
              className="contract-modal-input"
              value={contract.name}
              readOnly
            />
          </div>

          <div className="contract-modal-row">
            <label>หมายเลขห้อง</label>
            <input
              className="contract-modal-input"
              placeholder="เช่น A10"
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
            />
          </div>
        </div>

        <div className="contract-modal-footer">
          <button className="btn-contract-cancel" onClick={onClose}>
            ปิด
          </button>
          <button className="btn-contract-confirm" onClick={onConfirm}>
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractModal;
