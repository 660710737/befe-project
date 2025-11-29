package main

import (
	"database/sql"
	"log"

	_ "github.com/lib/pq"
)

var db *sql.DB

func initDB() {
	// ⚠️ เช็ค password ว่าตรงกับ docker-compose หรือเครื่องของคุณ
	connStr := "host=localhost port=5432 user=postgres password=yourpassword dbname=dorm_booking sslmode=disable TimeZone=Asia/Bangkok"

	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("cannot open db:", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("cannot connect db:", err)
	}

	log.Println("✅ Connected to PostgreSQL")
}

// ------------------ USERS DB FUNCTIONS ------------------

func dbCreateUser(u *User) error {
	return db.QueryRow(
		`INSERT INTO users (full_name, username, email, phone, password)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
		u.FullName, u.Username, u.Email, u.Phone, u.Password,
	).Scan(&u.ID)
}

func dbFindUserByUsername(username string) (*User, error) {
	row := db.QueryRow(
		`SELECT id, full_name, username, email, phone, password
         FROM users
         WHERE username = $1`,
		username,
	)

	u := &User{}
	err := row.Scan(&u.ID, &u.FullName, &u.Username, &u.Email, &u.Phone, &u.Password)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return u, nil
}

func dbFindUserByID(id int) (*User, error) {
	row := db.QueryRow(
		`SELECT id, full_name, username, email, phone, password
         FROM users
         WHERE id = $1`,
		id,
	)

	u := &User{}
	err := row.Scan(&u.ID, &u.FullName, &u.Username, &u.Email, &u.Phone, &u.Password)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return u, nil
}

// ------------------ BOOKINGS DB FUNCTIONS ------------------

func dbCreateBooking(b *Booking) error {
	return db.QueryRow(
		`INSERT INTO bookings 
        (user_id, building, people, move_in_date, status, created_at,
         guest1_name, guest1_phone, guest1_email,
         guest2_name, guest2_phone, guest2_email)
         VALUES ($1, $2, $3, $4, $5, $6,
                 $7, $8, $9,
                 $10, $11, $12)
         RETURNING id`,
		b.UserID, b.Building, b.People, b.MoveInDate, b.Status, b.CreatedAt,
		b.Guest1Name, b.Guest1Phone, b.Guest1Email,
		b.Guest2Name, b.Guest2Phone, b.Guest2Email,
	).Scan(&b.ID)
}

func dbListBookingsByUserID(userID int) ([]Booking, error) {
	rows, err := db.Query(
		`SELECT id, user_id, building, people, move_in_date, status, created_at,
                guest1_name, guest1_phone, guest1_email,
                guest2_name, guest2_phone, guest2_email
         FROM bookings
         WHERE user_id = $1
         ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Booking
	for rows.Next() {
		var b Booking
		if err := rows.Scan(
			&b.ID, &b.UserID, &b.Building, &b.People, &b.MoveInDate, &b.Status, &b.CreatedAt,
			&b.Guest1Name, &b.Guest1Phone, &b.Guest1Email,
			&b.Guest2Name, &b.Guest2Phone, &b.Guest2Email,
		); err != nil {
			return nil, err
		}
		list = append(list, b)
	}
	return list, nil
}

func dbListAllBookings() ([]Booking, error) {
	rows, err := db.Query(
		`SELECT id, user_id, building, people, move_in_date, status, created_at,
                guest1_name, guest1_phone, guest1_email,
                guest2_name, guest2_phone, guest2_email
         FROM bookings
         ORDER BY created_at DESC`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []Booking
	for rows.Next() {
		var b Booking
		if err := rows.Scan(
			&b.ID, &b.UserID, &b.Building, &b.People, &b.MoveInDate, &b.Status, &b.CreatedAt,
			&b.Guest1Name, &b.Guest1Phone, &b.Guest1Email,
			&b.Guest2Name, &b.Guest2Phone, &b.Guest2Email,
		); err != nil {
			return nil, err
		}
		list = append(list, b)
	}
	return list, nil
}

// ------------------ ADMIN DB FUNCTIONS ------------------

func dbFindAdminByUsername(username string) (*Admin, error) {
	row := db.QueryRow(
		`SELECT id, username, password, full_name
         FROM admins
         WHERE username = $1`,
		username,
	)

	a := &Admin{}
	err := row.Scan(&a.ID, &a.Username, &a.Password, &a.FullName)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return a, nil
}

func dbGetAllUsers() ([]User, error) {
	rows, err := db.Query(
		`SELECT id, full_name, username, email, phone
         FROM users
         ORDER BY id`,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.FullName, &u.Username, &u.Email, &u.Phone); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}

func dbDeleteUserByID(id int) error {
	_, err := db.Exec(`DELETE FROM users WHERE id = $1`, id)
	return err
}

// ✅ ฟังก์ชันอัปเดตสถานะ + วันที่ทำสัญญา (ที่ทำให้เกิด Error ถ้าขาดไป)
func dbUpdateBookingStatus(id int, status string, contractDate string) error {
	if contractDate != "" {
		// กรณีอนุมัติ (มีวันที่สัญญา)
		_, err := db.Exec(`UPDATE bookings SET status = $1, contract_date = $2 WHERE id = $3`, status, contractDate, id)
		return err
	}
	// กรณีปฏิเสธ (ไม่มีวันที่)
	_, err := db.Exec(`UPDATE bookings SET status = $1 WHERE id = $2`, status, id)
	return err
}

// ✅ Struct และฟังก์ชันสำหรับ Dashboard Stats
// ✅ Struct และฟังก์ชันสำหรับ Dashboard Stats
type DashboardStats struct {
	NewBookingsMonth int `json:"newBookingsMonth"`
	AllBookings      int `json:"allBookings"`
	ContractsToday   int `json:"contractsToday"`
	AvailableRooms   int `json:"availableRooms"`
}

func dbGetDashboardStats() (*DashboardStats, error) {
	stats := &DashboardStats{}

	// 1) จำนวนการจองใหม่ในเดือนนี้ (ดูจาก created_at)
	err := db.QueryRow(`
		SELECT COUNT(*) 
		FROM bookings 
		WHERE date_part('month', created_at) = date_part('month', CURRENT_DATE) 
		  AND date_part('year', created_at)  = date_part('year', CURRENT_DATE)
	`).Scan(&stats.NewBookingsMonth)
	if err != nil {
		return nil, err
	}

	// 2) การจองทั้งหมด
	err = db.QueryRow(`SELECT COUNT(*) FROM bookings`).Scan(&stats.AllBookings)
	if err != nil {
		return nil, err
	}

	// 3) สัญญาที่ต้องทำวันนี้
	// ตอนนี้ใช้ move_in_date = วันนี้
	// ถ้าต่อไปอยากเปลี่ยนไปใช้ contract_date ก็เปลี่ยน WHERE ตรงนี้ได้
	err = db.QueryRow(`
		SELECT COUNT(*) 
		FROM bookings 
		WHERE move_in_date = CURRENT_DATE
	`).Scan(&stats.ContractsToday)
	if err != nil {
		return nil, err
	}

	// 4) ห้องว่างทั้งหมด = จำนวนห้องทั้งหมด - ห้องที่มีการจอง (ยกเว้นที่ถูกยกเลิก/ปฏิเสธ)
	var occupied int
	err = db.QueryRow(`
		SELECT COUNT(*) 
		FROM bookings 
		WHERE status NOT IN ('rejected', 'cancelled', 'ปฏิเสธ', 'ยกเลิก')
	`).Scan(&occupied)
	if err != nil {
		return nil, err
	}

	const totalRooms = 160 // TODO: ถ้ามีจำนวนห้องจริงของหอ ให้เปลี่ยนเป็นค่าจริงได้เลย
	stats.AvailableRooms = totalRooms - occupied
	if stats.AvailableRooms < 0 {
		stats.AvailableRooms = 0
	}

	return stats, nil
}


type RoomStat struct {
	Building  string `json:"building"`
	Total     int    `json:"total"`
	Available int    `json:"available"`
}

func dbGetRoomStats() ([]RoomStat, error) {
	// 1. กำหนดจำนวนห้องทั้งหมด (Hardcode ไว้ก่อนเพราะเราไม่มี table เก็บ settings ตึก)
	const totalPerBuilding = 80 

	// 2. Query นับจำนวนห้องที่มีคนจองแล้ว (สถานะไม่ใช่ rejected หรือ cancelled) แยกตามตึก
    // *หมายเหตุ: นับ 'pending' ด้วยเพื่อกันห้องเต็ม
	rows, err := db.Query(`
		SELECT building, COUNT(*) 
		FROM bookings 
		WHERE status NOT IN ('rejected', 'cancelled', 'ปฏิเสธ', 'ยกเลิก')
		GROUP BY building
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// เตรียมข้อมูลเริ่มต้น (สมมติว่าว่างหมดก่อน)
	statsMap := map[string]int{
		"A": 0, // จำนวนคนจองตึก A
		"B": 0, // จำนวนคนจองตึก B
	}

	for rows.Next() {
		var b string
		var count int
		if err := rows.Scan(&b, &count); err == nil {
			statsMap[b] = count
		}
	}

	// 3. คำนวณห้องว่างและสร้าง Response
	var results []RoomStat
	// วนลูปสร้าง A และ B (เพื่อให้ลำดับแน่นอน)
	buildings := []string{"A", "B"}
	for _, bName := range buildings {
		occupied := statsMap[bName]
		available := totalPerBuilding - occupied
		
		// กันเหนียว: ไม่ให้ห้องว่างติดลบ
		if available < 0 { available = 0 }

		results = append(results, RoomStat{
			Building:  bName,
			Total:     totalPerBuilding,
			Available: available,
		})
	}

	return results, nil
}
