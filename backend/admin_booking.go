package main

import (
	"encoding/json" // 👈 ต้องเพิ่ม import ตัวนี้ด้วย
	"net/http"
)

// Admin ดูรายการจองทั้งหมด (ฟังก์ชันเดิมของคุณ)
func handleAdminBookings(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)

	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodGet {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	bookings, err := dbListAllBookings()
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "cannot query bookings",
		})
		return
	}

	respondJSON(w, http.StatusOK, bookings)
}

// ---------------- ส่วนที่ต้องเพิ่มใหม่ด้านล่างนี้ ----------------

// Struct สำหรับรับข้อมูลจาก Frontend (เพิ่ม ContractDate)
type updateBookingStatusRequest struct {
	ID           int    `json:"id"`
	Status       string `json:"status"`
	ContractDate string `json:"contractDate"` // 👈 รับค่าวันที่สัญญา
}

// Handler สำหรับอัปเดตสถานะ (Approve/Reject)
func handleAdminUpdateBookingStatus(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	var req updateBookingStatusRequest
	// แปลง JSON ที่ส่งมาใส่ struct
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}

	// เรียกฟังก์ชัน DB โดยส่ง ContractDate ไปด้วย
	// (อย่าลืมว่าต้องแก้ db.go ให้รับ 3 parameter ตามที่คุยกันก่อนหน้านี้นะครับ)
	if err := dbUpdateBookingStatus(req.ID, req.Status, req.ContractDate); err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{"error": "cannot update status"})
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "status updated"})
}