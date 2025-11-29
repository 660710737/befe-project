CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    username  TEXT NOT NULL UNIQUE,
    email     TEXT,
    phone     TEXT,
    password  TEXT NOT NULL
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    building VARCHAR(10) NOT NULL,
    people INT NOT NULL,
    move_in_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- เพิ่มคอลัมน์สำหรับ Guest 1
    guest1_name TEXT DEFAULT '',
    guest1_phone TEXT DEFAULT '',
    guest1_email TEXT DEFAULT '',

    -- เพิ่มคอลัมน์สำหรับ Guest 2
    guest2_name TEXT DEFAULT '',
    guest2_phone TEXT DEFAULT '',
    guest2_email TEXT DEFAULT '',
    contract_date DATE DEFAULT NULL,
    room_number VARCHAR(20) DEFAULT ''
);

CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username  TEXT NOT NULL UNIQUE,
    password  TEXT NOT NULL,
    full_name TEXT
);

INSERT INTO admins (username, password, full_name)
VALUES ('admin', '1', 'Dorm Admin');