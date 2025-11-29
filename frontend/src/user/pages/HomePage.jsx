import React from "react";
import InfoCard from "../components/InfoCard";
import SectionCard from "../components/SectionCard";
import "./../styles/HomePage.css";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate(); // [2] เรียกใช้ Hook

  // ฟังก์ชันสำหรับกดปุ่ม
  const handleBookingClick = () => {
    // ใส่ path ที่ต้องการไป เช่น '/booking', '/rooms', หรือ '/login'
    navigate("/rooms"); 
  };

  return (
    <main className="home-wrapper">
      <div className="home-hero-bg">
        <div className="page-container">
          {/* ส่วนหัวชื่อหอพัก */}
          <section className="home-hero">
            <div className="home-hero-text">
              <h1>หอพักใจ</h1>
              <p className="home-hero-subtitle">
                หอพักสำหรับนิสิตนักศึกษา
              </p>
              <p className="home-hero-desc">
                หอพักใจตั้งอยู่ใกล้มหาวิทยาลัย เดินทางสะดวก บรรยากาศเงียบสงบ
                เหมาะสำหรับการพักผ่อนและการเรียนหนังสือ
              </p>
              {/* <button className="btn-primary home-hero-btn" onClick={handleBookingClick}>
                จองห้องพักตอนนี้
              </button> */}
            </div>
          </section>

          <section className="home-hero">
            <div className="home-hero-text">
              <h2>รายละเอียดหอพัก</h2>
            </div>
          </section>

          {/* การ์ดข้อมูลสรุปห้อง */}
          <div className="detail-wrapper">

            {/* TOP SUMMARY */}
            <div className="detail-grid">
              <div className="detail-card">
                <h3>2 อาคาร</h3>
                <p>อาคาร A และ อาคาร B</p>
              </div>

              <div className="detail-card">
                <h3>1–2 คน/ห้อง</h3>
                <p>พักได้สูงสุด 2 คน</p>
              </div>
            </div>

            <div className="detail-grid mt-20">
              <div className="detail-card">
                <h3>ขนาดห้อง</h3>
                <p>20 ตร.ม.</p>
              </div>

              <div className="detail-card">
                <h3>54,000 บาท/ปี</h3>
                <p>ค่าเช่า 4,500 บาท/เดือน</p>
              </div>
            </div>

            {/* EXTRA INFO */}
            <section className="info-card-section">
              <div className="info-card-container">

                <h2 className="info-title">ข้อมูลเพิ่มเติม</h2>

                <div className="info-inner-grid">

                  {/* กล่องซ้าย */}
                  <div className="info-inner-box light-blue">
                    <h3>ค่าใช้จ่ายรายเดือน</h3>
                    <ul>
                      <li>ค่าไฟฟ้า: ตามมิเตอร์จริง (7 บาท/หน่วย)</li>
                      <li>ค่าน้ำประปา: 150 บาท/เดือน</li>
                      <li>อินเทอร์เน็ต WiFi: ฟรี</li>
                    </ul>
                  </div>

                  {/* กล่องขวา */}
                  <div className="info-inner-box light-yellow">
                    <h3>ค่าใช้จ่ายรายเดือน</h3>
                    <ul>
                      <li>ค่าประกันห้อง: 3,000 บาท (คืนเมื่อสิ้นสุดสัญญา)</li>
                      <li>ชำระค่าเช่าล่วงหน้า 1 ปี</li>
                      <li>สัญญาเช่าขั้นต่ำ 1 ปี</li>
                    </ul>
                  </div>

                </div>

              </div>
            </section>

          </div>

          <section className="section-card">
            <h2 className="info-title">อาคาร A / B ต่างกันอย่างไร?</h2>

            <p className="section-desc">
              แม้อาคาร A และ B จะมีห้องพักมาตรฐานและสิ่งอำนวยความสะดวกเหมือนกัน
              แต่แต่ละอาคารมีบรรยากาศที่แตกต่างกันเล็กน้อย เพื่อให้คุณเลือกตามความชอบ
            </p>

            <div className="ab-grid">
              <div className="ab-box pink">
                <h3>A</h3>
                <p>ใกล้ประตูทางเข้า<br />เดินไปมหาวิทยาลัยสะดวก<br />บรรยากาศคึกคักกว่า</p>
              </div>

              <div className="ab-box mint">
                <h3>B</h3>
                <p>อยู่โซนด้านใน<br />เงียบกว่า<br />เหมาะกับผู้ที่ต้องการความเป็นส่วนตัว</p>
              </div>
            </div>
          </section>

          <section className="home-hero">
            <div className="home-hero-text">
              <h2>สิ่งอำนวยความสะดวก</h2>
            </div>
          </section>

          {/* สิ่งอำนวยความสะดวก + ความปลอดภัย */}
          {/* สิ่งอำนวยความสะดวก */}
          <section className="amenity-grid">

            {/* 1. ภายในห้อง */}
            <div className="amenity-card">
              <h2 className="amenity-title">ภายในห้อง</h2>
              <ul className="amenity-list">
                <li><i class="fi fi-rr-air-conditioner"></i> เครื่องปรับอากาศ</li>
                <li><i class="fi fi-rr-wifi"></i> Wi-Fi ความเร็วสูง</li>
                <li><i class="fi fi-rr-bed"></i> เตียงพร้อมที่นอน</li>
                <li><i class="fi fi-rr-refrigerator"></i> ตู้เย็น</li>
                <li><i class="fi fi-rr-chair"></i> โต๊ะทำงาน เก้าอี้</li>
                <li><i class="fi fi-rr-clothes-hanger"></i> ตู้เสื้อผ้า</li>
                <li><i class="fi fi-rr-shower"></i> ห้องน้ำในตัว พร้อมเครื่องทำน้ำอุ่น</li>
              </ul>
            </div>

            {/* 2. ส่วนกลาง */}
            <div className="amenity-card">
              <h2 className="amenity-title">ส่วนกลาง</h2>
              <ul className="amenity-list">
                <li><i class="fi fi-rr-washer"></i> เครื่องซักผ้าหยอดเหรียญ</li>
                <li><i class="fi fi-rr-parking"></i> ที่จอดรถ</li>
                <li><i class="fi fi-rr-elevator"></i> ลิฟต์</li>
                <li><i class="fi fi-rr-water-bottle"></i> ตู้น้ำดื่ม</li>
                <li><i class="fi fi-rr-coffee"></i> พื้นที่พักผ่อนส่วนกลาง</li>
                <li><i class="fi fi-rr-box"></i> ตู้รับพัสดุ</li>
              </ul>
            </div>

            {/* 3. ความปลอดภัย */}
            <div className="amenity-card">
              <h2 className="amenity-title">ความปลอดภัย</h2>
              <ul className="amenity-list">
                <li><i class="fi fi-rr-camera"></i> กล้อง CCTV 24 ชม.</li>
                <li><i class="fi fi-rr-id-badge"></i> ระบบคีย์การ์ด</li>
                <li><i class="fi fi-rc-user-police"></i> รปภ. ประจำ</li>
                <li><i class="fi fi-rr-alarm-exclamation"></i> สัญญาณเตือนไฟไหม้</li>
                <li><i class="fi fi-rr-fire-extinguisher"></i> ถังดับเพลิงทุกชั้น</li>
              </ul>
            </div>
          </section>

          <section className="home-hero">
            <div className="home-hero-text">
              <h2>ที่ตั้งและการเดินทาง</h2>
            </div>
          </section>


          {/* ที่ตั้ง / การเดินทาง */}
          <section className="location-section">

            <div className="location-card">

              <h3 className="loc-header">ที่อยู่</h3>
              <p className="loc-address">ถนนทรงพล 5 นครปฐม</p>

              <div className="distance-box">
                <h4 className="distance-title">ระยะทางถึงสถานที่สำคัญ</h4>

                <div className="distance-item">
                  <span>มหาวิทยาลัยศิลปากร</span>
                  <span className="distance">500 ม.</span>
                </div>

                <div className="distance-item">
                  <span>7-Eleven</span>
                  <span className="distance">100 ม.</span>
                </div>

                <div className="distance-item">
                  <span>ท่ารถตู้</span>
                  <span className="distance">200 ม.</span>
                </div>

              </div>
            </div>
          </section>

          {/* แถบติดต่อ */}
          <section className="home-contact">
            <div className="home-contact-bar gradient-bottom">
              <span>ติดต่อสอบถาม</span>
              <strong>02-232-2323</strong>
            </div>

          </section>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
