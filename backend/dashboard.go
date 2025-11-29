package main

import "net/http"

// handleAdminDashboardStats ดึงข้อมูลสรุปจาก dbGetDashboardStats()
func handleAdminDashboardStats(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)

	// รองรับ preflight ของ CORS
	if r.Method == http.MethodOptions {
		return
	}

	if r.Method != http.MethodGet {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	stats, err := dbGetDashboardStats()
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "cannot fetch dashboard stats",
		})
		return
	}

	// ส่ง struct ตรง ๆ กลับไปได้เลย เพราะ field / json tag ตรงกับฝั่ง React แล้ว
	respondJSON(w, http.StatusOK, stats)
}
