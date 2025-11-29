package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
)

// -------- session / user utilities --------

func randString(n int) string {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}

func createSession(w http.ResponseWriter, userID int) {
	sessionID := randString(16)

	sessionsMu.Lock()
	sessions[sessionID] = userID
	sessionsMu.Unlock()

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    sessionID,
		Path:     "/",
		HttpOnly: true,
		// Secure: true ถ้าใช้ https
	})
}

func getUserFromSession(r *http.Request) (*User, error) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		return nil, nil
	}

	sessionID := cookie.Value

	sessionsMu.Lock()
	userID, ok := sessions[sessionID]
	sessionsMu.Unlock()
	if !ok {
		return nil, nil
	}

	return dbFindUserByID(userID)
}

func requireAuth(w http.ResponseWriter, r *http.Request) (*User, bool) {
	u, err := getUserFromSession(r)
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{"error": "internal error"})
		return nil, false
	}
	if u == nil {
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return nil, false
	}
	return u, true
}

// -------- handlers: user auth --------

type registerRequest struct {
	FullName string `json:"fullName"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

func handleRegister(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	var req registerRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}

	if req.Username == "" || req.Password == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{
			"error": "username and password are required",
		})
		return
	}

	u := &User{
		FullName: req.FullName,
		Username: req.Username,
		Email:    req.Email,
		Phone:    req.Phone,
		Password: req.Password,
	}

	if err := dbCreateUser(u); err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{"error": "cannot create user"})
		return
	}

	createSession(w, u.ID)
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":       u.ID,
		"fullName": u.FullName,
		"username": u.Username,
		"email":    u.Email,
		"phone":    u.Phone,
	})
}

type loginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func handleLogin(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	var req loginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}

	u, err := dbFindUserByUsername(req.Username)
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{"error": "cannot query user"})
		return
	}
	if u == nil || u.Password != req.Password {
		respondJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid credentials"})
		return
	}

	createSession(w, u.ID)
	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":       u.ID,
		"fullName": u.FullName,
		"username": u.Username,
		"email":    u.Email,
		"phone":    u.Phone,
	})
}

func handleLogout(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	cookie, err := r.Cookie("session_id")
	if err == nil {
		sessionsMu.Lock()
		delete(sessions, cookie.Value)
		sessionsMu.Unlock()
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_id",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	})

	respondJSON(w, http.StatusOK, map[string]string{"message": "logged out"})
}

func handleProfile(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodGet {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	u, ok := requireAuth(w, r)
	if !ok {
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"id":       u.ID,
		"fullName": u.FullName,
		"username": u.Username,
		"email":    u.Email,
		"phone":    u.Phone,
	})
}

// -------------- handler: admin login (ใช้ table admins) --------------

type adminLoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func handleAdminLogin(w http.ResponseWriter, r *http.Request) {
	enableCORS(w, r)
	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		respondJSON(w, http.StatusMethodNotAllowed, nil)
		return
	}

	var req adminLoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid json"})
		return
	}

	if req.Username == "" || req.Password == "" {
		respondJSON(w, http.StatusBadRequest, map[string]string{
			"error": "username and password are required",
		})
		return
	}

	admin, err := dbFindAdminByUsername(req.Username)
	if err != nil {
		respondJSON(w, http.StatusInternalServerError, map[string]string{
			"error": "cannot query database",
		})
		return
	}
	if admin == nil || admin.Password != req.Password {
		respondJSON(w, http.StatusUnauthorized, map[string]string{
			"error": "invalid admin credentials",
		})
		return
	}

	respondJSON(w, http.StatusOK, map[string]interface{}{
		"message": "admin logged in",
		"admin": map[string]interface{}{
			"id":       admin.ID,
			"username": admin.Username,
			"fullName": admin.FullName,
		},
	})
}
