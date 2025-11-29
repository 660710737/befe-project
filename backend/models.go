package main

import (
	"sync"
	"time"
)

type User struct {
	ID       int    `json:"id"`
	FullName string `json:"fullName"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"-"` // ไม่ส่งกลับ client
}

type Booking struct {
	ID         int       `json:"id"`
	UserID     int       `json:"userId"`
	Building   string    `json:"building"`
	People     int       `json:"people"`
	MoveInDate string    `json:"moveInDate"`
	Status     string    `json:"status"`
	CreatedAt  time.Time `json:"createdAt"`

	// ข้อมูล Guest 1 (เจ้าของ account)
	Guest1Name  string `json:"guest1Name"`
	Guest1Phone string `json:"guest1Phone"`
	Guest1Email string `json:"guest1Email"`

	// ข้อมูล Guest 2 (รูมเมท)
	Guest2Name  string `json:"guest2Name"`
	Guest2Phone string `json:"guest2Phone"`
	Guest2Email string `json:"guest2Email"`

	// Fields เก่าสำหรับ return json (optional)
	Name  string `json:"name,omitempty"`
	Phone string `json:"phone,omitempty"`
	Email string `json:"email,omitempty"`

}

var (
	bookingsMu    sync.Mutex
	sessionsMu    sync.Mutex
	bookings      = []Booking{}
	sessions      = map[string]int{} // session_id -> userID
	nextBookingID = 1
)

// ---- Admin model สำหรับตาราง admins ----

type Admin struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"-"`       // ไม่ส่งกลับไป client
	FullName string `json:"fullName"`
}
