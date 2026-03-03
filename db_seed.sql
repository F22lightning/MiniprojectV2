-- =============================================
-- ระบบ: Kitchen Buddy (KDS & SOP System)
-- รายละเอียด: เพิ่มข้อมูลตั้งต้น (Seed Data)
-- =============================================

USE testdb;

-- 1. เพิ่มข้อมูลหมวดหมู่ (tbcategory)
INSERT INTO tbcategory (categoryname) VALUES 
('อาหารจานหลัก (Main Course)'),
('ทานเล่น (Appetizer)'),
('เครื่องดื่ม (Beverage)');

-- 2. เพิ่มข้อมูลรายการเมนู (tbmenu)
-- หมวด 1: อาหารจานหลัก
INSERT INTO tbmenu (categoryid, menuname) VALUES 
(1, 'ผัดกะเพราหมูสับไข่ดาว'),
(1, 'ข้าวผัดกุ้ง'),
-- หมวด 2: ทานเล่น
(2, 'เฟรนช์ฟรายส์ทอด'),
-- หมวด 3: เครื่องดื่ม
(3, 'ชามะนาว');

-- 3. เพิ่มข้อมูลคู่มือการทำ (tbcookingguide)
-- ผัดกะเพราหมูสับไข่ดาว (menuid 1)
INSERT INTO tbcookingguide (menuid, instruction, standardtime) VALUES 
(1, '1. ตั้งกระทะใส่น้ำมันให้ร้อน\n2. เจียวกระเทียมและพริกให้หอม\n3. ใส่หมูสับรวนจนสุก\n4. ปรุงรสด้วยซอสหอยนางรม ซีอิ๊วขาว น้ำตาล\n5. ใส่ใบกะเพราผัดให้เข้ากัน\n6. เสิร์ฟพร้อมข้าวสวยและไข่ดาวทอดกรอบ', 300);

-- ข้าวผัดกุ้ง (menuid 2)
INSERT INTO tbcookingguide (menuid, instruction, standardtime) VALUES 
(2, '1. ตั้งกระทะใส่น้ำมัน ใส่กระเทียมสับ\n2. นำกุ้งลงไปผัดจนสุกปานกลาง\n3. ใส่ไข่ไก่ คั่วไข่ให้สุก\n4. ใส่ข้าวสวยลงผัด ปรุงรสด้วยซอสปรุงรส\n5. โรยต้นหอมซอย ผัดให้เข้ากัน พร้อมเสิร์ฟ', 420);

-- เฟรนช์ฟรายส์ทอด (menuid 3)
INSERT INTO tbcookingguide (menuid, instruction, standardtime) VALUES 
(3, '1. นำเฟรนช์ฟรายส์แช่แข็งลงทอดในน้ำมันร้อน 170 องศาเซลเซียส\n2. ทอดทิ้งไว้ประมาณ 3-5 นาทีจนเป็นสีเหลืองทอง\n3. ตักขึ้นสะเด็ดน้ำมัน คลุกเกลือเล็กน้อย\n4. เสิร์ฟพร้อมซอสมะเขือเทศ', 240);

-- ชามะนาว (menuid 4)
INSERT INTO tbcookingguide (menuid, instruction, standardtime) VALUES 
(4, '1. ชงน้ำชาดำเตรียมไว้\n2. เติมน้ำเชื่อม 30ml และน้ำมะนาวคั้นสด 15ml\n3. คนให้เข้ากัน\n4. เทใส่แก้วที่มีน้ำแข็งเต็มแก้ว ตกแต่งด้วยเลมอนฝานฝาน', 120);

-- 4. ข้ออมูลออเดอร์ตั้งต้น (สถานการณ์จำลอง)
INSERT INTO tborder (queueno, orderstatus, start_at) VALUES 
(101, 'กำลังทำ', CURRENT_TIMESTAMP),
(102, 'รอคิว', NULL);

-- ออเดอร์ 101: ข้าวผัดกุ้ง 2 จาน, ชามะนาว 1 แก้ว
INSERT INTO tborderdetail (orderid, menuid, quantity, special_note) VALUES 
(1, 2, 2, 'ไม่ใส่ผักชี'),
(1, 4, 1, 'หวานน้อย');

-- ออเดอร์ 102: ผัดกะเพรา 1 จาน (ไข่ดาวไม่สุก)
INSERT INTO tborderdetail (orderid, menuid, quantity, special_note) VALUES 
(2, 1, 1, 'ไข่ดาวเยิ้มๆ');
