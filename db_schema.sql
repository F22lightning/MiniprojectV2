-- =============================================
-- ระบบ: Kitchen Buddy (KDS & SOP System)
-- รายละเอียด: สร้างโครงสร้างฐานข้อมูลเชิงกายภาพ (Physical Design)
-- =============================================

-- 1. สร้างตารางหมวดหมู่ (tbcategory)
CREATE TABLE tbcategory (
    categoryid INT AUTO_INCREMENT,
    categoryname VARCHAR(100) NOT NULL,
    CONSTRAINT PKcategory PRIMARY KEY (categoryid)
);

-- 2. สร้างตารางรายการเมนู (tbmenu)
CREATE TABLE tbmenu (
    menuid INT AUTO_INCREMENT,
    categoryid INT NOT NULL,
    menuname VARCHAR(150) NOT NULL,
    CONSTRAINT PKmenu PRIMARY KEY (menuid),
    CONSTRAINT FKcategory_menu FOREIGN KEY (categoryid) REFERENCES tbcategory(categoryid)
);

-- 3. สร้างตารางคู่มือการทำ (tbcookingguide)
-- เชื่อมแบบ 1:1 กับ tbmenu โดยใช้ UNIQUE Constraint
CREATE TABLE tbcookingguide (
    guideid INT AUTO_INCREMENT,
    menuid INT UNIQUE NOT NULL,
    instruction TEXT NOT NULL,
    standardtime INT DEFAULT 0,
    CONSTRAINT PKguide PRIMARY KEY (guideid),
    CONSTRAINT FKmenu_guide FOREIGN KEY (menuid) REFERENCES tbmenu(menuid)
);

-- 4. สร้างตารางรายการสั่งซื้อ (tborder)
CREATE TABLE tborder (
    orderid INT AUTO_INCREMENT,
    queueno INT NOT NULL,
    orderat DATETIME DEFAULT CURRENT_TIMESTAMP,
    orderstatus VARCHAR(20) NOT NULL DEFAULT 'รอคิว', -- รอคิว, กำลังทำ, เสร็จสิ้น
    start_at DATETIME NULL,
    finish_at DATETIME NULL,
    CONSTRAINT PKorder PRIMARY KEY (orderid)
);

-- 5. สร้างตารางรายละเอียดออเดอร์ (tborderdetail)
CREATE TABLE tborderdetail (
    detailid INT AUTO_INCREMENT,
    orderid INT NOT NULL,
    menuid INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    special_note TEXT NULL,
    CONSTRAINT PKdetail PRIMARY KEY (detailid),
    CONSTRAINT FKorder_detail FOREIGN KEY (orderid) REFERENCES tborder(orderid),
    CONSTRAINT FKmenu_detail FOREIGN KEY (menuid) REFERENCES tbmenu(menuid)
);