package main

import (
	"log"
	"net/http"
	"strconv"
)

// สำหรับหน้า admin members: ดูรายชื่อสมาชิก + ลบสมาชิก
func handleAdminUsers(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)

	log.Println("handleAdminUsers method:", r.Method)

	// preflight CORS
	if r.Method == http.MethodOptions {
		w.Header().Set("Access-Control-Allow-Methods", "GET,DELETE,OPTIONS")
		return
	}

	switch r.Method {
	case http.MethodGet:
		users, err := dbGetAllUsers()
		if err != nil {
			respondJSON(w, http.StatusInternalServerError, map[string]string{
				"error": "cannot query users",
			})
			return
		}
		respondJSON(w, http.StatusOK, users)

	case http.MethodDelete:
		idStr := r.URL.Query().Get("id")
		if idStr == "" {
			respondJSON(w, http.StatusBadRequest, map[string]string{
				"error": "missing id",
			})
			return
		}

		id, err := strconv.Atoi(idStr)
		if err != nil {
			respondJSON(w, http.StatusBadRequest, map[string]string{
				"error": "invalid id",
			})
			return
		}

		if err := dbDeleteUserByID(id); err != nil {
			respondJSON(w, http.StatusInternalServerError, map[string]string{
				"error": "cannot delete user",
			})
			return
		}

		respondJSON(w, http.StatusOK, map[string]string{
			"message": "deleted",
		})

	default:
		respondJSON(w, http.StatusMethodNotAllowed, nil)
	}
}
