import React, { useState, useEffect } from "react";
import "../styles/RoomAvailability.css"; // (เดี๋ยวสร้างไฟล์ css ในข้อถัดไป)

const RoomAvailability = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/room-availability");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Error fetching room stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div style={{textAlign:"center", padding:"10px"}}>กำลังโหลดข้อมูล...</div>;

  return (
    <div className="ra-table-wrapper">
      <table className="ra-table">
        <thead>
          <tr>
            <th>อาคาร</th>
            <th>ห้องทั้งหมด</th>
            <th>ห้องว่าง</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((row, index) => (
            <tr key={index}>
              <td style={{ textAlign: "left", paddingLeft: "20px" }}>{row.building}</td>
              <td>{row.total}</td>
              {/* ถ้าห้องว่างน้อยกว่า 5 ให้เป็นสีแดง */}
              <td className={row.available < 5 ? "text-red" : "text-green"}>
                {row.available}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomAvailability;