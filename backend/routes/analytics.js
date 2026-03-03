const express = require('express');
const router = express.Router();
const db = require('../db');

// Get generic dashboard stats for today
router.get('/stats', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

        // 1. Total orders today
        const [[{ total_orders }]] = await db.query(`
            SELECT COUNT(*) as total_orders 
            FROM รายการสั่งซื้อ_Order 
            WHERE DATE(วันที่เวลา_สั่ง) = ?
        `, [today]);

        // 2. Total completed today
        const [[{ completed_orders }]] = await db.query(`
            SELECT COUNT(*) as completed_orders 
            FROM รายการสั่งซื้อ_Order 
            WHERE DATE(วันที่เวลา_สั่ง) = ? AND สถานะออเดอร์ = 'เสร็จสิ้น'
        `, [today]);

        // 3. Best selling items
        const [bestSellers] = await db.query(`
            SELECT m.ชื่อเมนู, SUM(d.จำนวน) as total_sold
            FROM รายละเอียดออเดอร์ d
            JOIN รายการเมนู m ON d.ID_เมนู = m.ID_เมนู
            JOIN รายการสั่งซื้อ_Order o ON d.ID_ออเดอร์ = o.ID_ออเดอร์
            WHERE DATE(o.วันที่เวลา_สั่ง) = ?
            GROUP BY m.ID_เมนู, m.ชื่อเมนู
            ORDER BY total_sold DESC
            LIMIT 5
        `, [today]);

        // 4. Average cook time vs SOP time per menu
        const [timingStats] = await db.query(`
            SELECT 
                m.ชื่อเมนู,
                c.เวลามาตรฐาน_นาที as sop_time,
                ROUND(AVG(TIMESTAMPDIFF(MINUTE, o.เวลาที่เริ่มทำ, o.เวลาที่เสร็จสิ้น)), 1) as avg_actual_time
            FROM รายการสั่งซื้อ_Order o
            JOIN รายละเอียดออเดอร์ d ON o.ID_ออเดอร์ = d.ID_ออเดอร์
            JOIN รายการเมนู m ON d.ID_เมนู = m.ID_เมนู
            LEFT JOIN คู่มือการทำ c ON m.ID_เมนู = c.ID_เมนู
            WHERE o.สถานะออเดอร์ = 'เสร็จสิ้น' 
              AND o.เวลาที่เริ่มทำ IS NOT NULL 
              AND o.เวลาที่เสร็จสิ้น IS NOT NULL
              AND DATE(o.วันที่เวลา_สั่ง) = ?
            GROUP BY m.ID_เมนู, m.ชื่อเมนู, c.เวลามาตรฐาน_นาที
        `, [today]);

        res.json({
            today,
            total_orders,
            completed_orders,
            bestSellers,
            timingStats
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
