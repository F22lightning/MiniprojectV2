const express = require('express');
const router = express.Router();
const db = require('../db');

// --- Categories ---
router.post('/categories', async (req, res) => {
    try {
        const { ชื่อหมวดหมู่ } = req.body;
        const [result] = await db.query('INSERT INTO หมวดหมู่ (ชื่อหมวดหมู่) VALUES (?)', [ชื่อหมวดหมู่]);
        res.status(201).json({ ID_หมวดหมู่: result.insertId, ชื่อหมวดหมู่ });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// --- Menus ---
router.post('/menus', async (req, res) => {
    try {
        const { ID_หมวดหมู่, ชื่อเมนู } = req.body;
        const [result] = await db.query('INSERT INTO รายการเมนู (ID_หมวดหมู่, ชื่อเมนู) VALUES (?, ?)', [ID_หมวดหมู่, ชื่อเมนู]);
        res.status(201).json({ ID_เมนู: result.insertId, ID_หมวดหมู่, ชื่อเมนู });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.put('/menus/:id', async (req, res) => {
    try {
        const { ID_หมวดหมู่, ชื่อเมนู } = req.body;
        await db.query('UPDATE รายการเมนู SET ID_หมวดหมู่ = ?, ชื่อเมนู = ? WHERE ID_เมนู = ?', [ID_หมวดหมู่, ชื่อเมนู, req.params.id]);
        res.json({ message: 'Menu updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.delete('/menus/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM รายการเมนู WHERE ID_เมนู = ?', [req.params.id]);
        res.json({ message: 'Menu deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// --- Cooking Guides (SOP) ---
router.put('/guides/:menuId', async (req, res) => {
    try {
        const { วิธีการทำ_สูตร, ลิงก์รูปภาพประกอบ, เวลามาตรฐาน_นาที } = req.body;

        // Check if guide exists
        const [existing] = await db.query('SELECT ID_คู่มือ FROM คู่มือการทำ WHERE ID_เมนู = ?', [req.params.menuId]);

        if (existing.length > 0) {
            // Update
            await db.query(
                'UPDATE คู่มือการทำ SET วิธีการทำ_สูตร = ?, ลิงก์รูปภาพประกอบ = ?, เวลามาตรฐาน_นาที = ? WHERE ID_เมนู = ?',
                [วิธีการทำ_สูตร, ลิงก์รูปภาพประกอบ, เวลามาตรฐาน_นาที, req.params.menuId]
            );
        } else {
            // Insert
            await db.query(
                'INSERT INTO คู่มือการทำ (ID_เมนู, วิธีการทำ_สูตร, ลิงก์รูปภาพประกอบ, เวลามาตรฐาน_นาที) VALUES (?, ?, ?, ?)',
                [req.params.menuId, วิธีการทำ_สูตร, ลิงก์รูปภาพประกอบ, เวลามาตรฐาน_นาที]
            );
        }
        res.json({ message: 'Guide saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;
