package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	// เชื่อมต่อฐานข้อมูล
	initDB()

	// ---------- User routes ----------
	http.HandleFunc("/api/register", handleRegister)
	http.HandleFunc("/api/login", handleLogin)
	http.HandleFunc("/api/logout", handleLogout)
	http.HandleFunc("/api/profile", handleProfile)

	// การจองของผู้ใช้ (GET = ดูของตัวเอง, POST = สร้างการจองใหม่)
	http.HandleFunc("/api/bookings", handleBookings)

	// ---------- Admin routes ----------
	http.HandleFunc("/api/admin/login", handleAdminLogin)
	http.HandleFunc("/api/admin/bookings", handleAdminBookings)
	http.HandleFunc("/api/admin/bookings/update", handleAdminUpdateBookingStatus)
	http.HandleFunc("/api/admin/users", handleAdminUsers)
	http.HandleFunc("/api/admin/contracts", handleAdminContracts)
	http.HandleFunc("/api/admin/contracts/confirm", handleAdminConfirmContract)

	// ✅ ใหม่: Dashboard stats
	http.HandleFunc("/api/admin/dashboard-stats", handleAdminDashboardStats)

	// ---------- Room availability (ฝั่งหน้า user) ----------
	http.HandleFunc("/api/room-availability", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w, r)
		if r.Method == http.MethodOptions {
			return
		}

		stats, err := dbGetRoomStats()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json; charset=utf-8")
		json.NewEncoder(w).Encode(stats)
	})

	// ---------- Start server ----------
	fmt.Println("Backend running at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
