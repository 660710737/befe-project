package main

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

// 1. API ดึงรายการสัญญา (เอาเฉพาะที่ อนุมัติแล้ว หรือ ทำสัญญาแล้ว)
func handleAdminContracts(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions { return }
	if r.Method != http.MethodGet {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	// Query ข้อมูล: เอา status 'approved' (รอทำสัญญา) และ 'contract_signed' (เสร็จแล้ว)
	rows, err := db.Query(`
		SELECT id, user_id, building, people, move_in_date, status, contract_date, room_number,
		       guest1_name, guest2_name
		FROM bookings
		WHERE status IN ('approved', 'อนุมัติแล้ว', 'contract_signed')
		ORDER BY move_in_date ASC
	`)
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{"error": err.Error()})
		return
	}
	defer rows.Close()

	var list []map[string]interface{}

	for rows.Next() {
		var id, userId, people int
		var building, status, g1, g2 string
		var moveInDate, contractDate string // รับเป็น string ไปก่อนเดี๋ยว database/sql แปลงให้
		var roomNumber sql.NullString       // รับเป็น NullString เผื่อยังไม่มีเลขห้อง

		if err := rows.Scan(&id, &userId, &building, &people, &moveInDate, &status, &contractDate, &roomNumber, &g1, &g2); err != nil {
			// ถ้า scan contract_date ไม่ได้ (เป็น null) ให้ข้าม error นี้ไป
			contractDate = "" 
		}

		// จัดชื่อแสดงผล
		displayName := g1
		if people == 2 && g2 != "" {
			displayName = g1 + ", " + g2
		}

		list = append(list, map[string]interface{}{
			"id":           id,
			"name":         displayName,
			"building":     building,
			"moveInDate":   moveInDate,
			"contractDate": contractDate,
			"status":       status,
			"roomNumber":   roomNumber.String,
		})
	}

	respondJSON(w, http.StatusOK, list)
}

// 2. API บันทึกการทำสัญญา (ใส่เลขห้อง + เปลี่ยนสถานะ)
type confirmContractRequest struct {
	ID         int    `json:"id"`
	RoomNumber string `json:"roomNumber"`
}

func handleAdminConfirmContract(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions { return }
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	var req confirmContractRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}

	// อัปเดต DB: ใส่เลขห้อง และเปลี่ยนสถานะเป็น 'contract_signed'
	_, err := db.Exec(`
		UPDATE bookings 
		SET room_number = $1, status = 'contract_signed' 
		WHERE id = $2
	`, req.RoomNumber, req.ID)

	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{"error": "update failed"})
		return
	}

	respondJSON(w, http.StatusOK, map[string]string{"message": "contract confirmed"})
}