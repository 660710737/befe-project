package main

import (
	"encoding/json"
	"net/http"
	"time"
)

// ใส่ฟังก์ชันต่าง ๆ ต่อจากนี้
type createBookingRequest struct {
	Building   string `json:"building"`
	People     int    `json:"people"`
	MoveInDate string `json:"moveInDate"`

	Guest1Name  string `json:"guest1Name"`
	Guest1Phone string `json:"guest1Phone"`
	Guest1Email string `json:"guest1Email"`

	Guest2Name  string `json:"guest2Name"`
	Guest2Phone string `json:"guest2Phone"`
	Guest2Email string `json:"guest2Email"`
}

func handleBookings(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}

	switch r.Method {
	case http.MethodGet:
		handleListMyBookings(w, r)
	case http.MethodPost:
		handleCreateBooking(w, r)
	default:
		respondJSON(w, http.StatusMethodNotAllowed, nil)
	}
}

func handleListMyBookings(w http.ResponseWriter, r *http.Request) {
	user, ok := requireAuth(w, r)
	if !ok {
		return
	}

	list, err := dbListBookingsByUserID(user.ID)
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "cannot query bookings",
		})
		return
	}

	respondJSON(w, http.StatusOK, list)
}

func handleCreateBooking(w http.ResponseWriter, r *http.Request) {
	user, ok := requireAuth(w, r)
	if !ok {
		return
	}

	var req createBookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{
			"error": "invalid json",
		})
		return
	}

	if req.Building == "" || req.People <= 0 || req.MoveInDate == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{
			"error": "building, people and moveInDate are required",
		})
		return
	}

	b := &Booking{
		UserID:     user.ID,
		Building:   req.Building,
		People:     req.People,
		MoveInDate: req.MoveInDate,
		Status:     "รอตรวจสอบ",
		CreatedAt:  time.Now(),

		Guest1Name:  req.Guest1Name,
		Guest1Phone: req.Guest1Phone,
		Guest1Email: req.Guest1Email,

		Guest2Name:  req.Guest2Name,
		Guest2Phone: req.Guest2Phone,
		Guest2Email: req.Guest2Email,
	}

	if err := dbCreateBooking(b); err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "cannot create booking",
		})
		return
	}

	respondJSON(w, http.StatusCreated, b)
}
