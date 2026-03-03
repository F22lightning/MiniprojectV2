const express = require('express');
const router = express.Router();
const db = require('../db');

// 1. Get all categories
router.get('/categories', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbcategory');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 2. Get all menus with their category names
router.get('/menus', async (req, res) => {
    try {
        const query = `
            SELECT m.menuid, m.menuname, c.categoryname, c.categoryid 
            FROM tbmenu m 
            JOIN tbcategory c ON m.categoryid = c.categoryid
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 3. Get cooking guide for a specific menu
router.get('/menus/:id/guide', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tbcookingguide WHERE menuid = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Guide not found for this menu' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 4. Get active orders (for Kitchen Display)
router.get('/orders', async (req, res) => {
    try {
        const query = `
            SELECT o.orderid, o.queueno, o.orderat, o.orderstatus, o.start_at, o.finish_at,
                   d.detailid, d.quantity, d.special_note, m.menuname, m.menuid
            FROM tborder o
            JOIN tborderdetail d ON o.orderid = d.orderid
            JOIN tbmenu m ON d.menuid = m.menuid
            WHERE o.orderstatus IN ('รอคิว', 'กำลังทำ')
            ORDER BY o.queueno ASC
        `;
        const [rows] = await db.query(query);

        // Group details by order
        const ordersMap = new Map();
        rows.forEach(row => {
            if (!ordersMap.has(row.orderid)) {
                ordersMap.set(row.orderid, {
                    orderid: row.orderid,
                    queueno: row.queueno,
                    orderat: row.orderat,
                    orderstatus: row.orderstatus,
                    start_at: row.start_at,
                    finish_at: row.finish_at,
                    items: []
                });
            }
            ordersMap.get(row.orderid).items.push({
                detailid: row.detailid,
                menuid: row.menuid,
                menuname: row.menuname,
                quantity: row.quantity,
                special_note: row.special_note
            });
        });

        res.json(Array.from(ordersMap.values()));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// 5. Create a new order (from Cashier)
router.post('/orders', async (req, res) => {
    const { queueno, items } = req.body;
    // items should be an array of: { menuid, quantity, special_note }

    if (!queueno || !items || !items.length) {
        return res.status(400).json({ message: 'Invalid order data' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insert into tborder
        const [orderResult] = await connection.query(
            'INSERT INTO tborder (queueno, orderstatus) VALUES (?, ?)',
            [queueno, 'รอคิว']
        );
        const orderid = orderResult.insertId;

        // Insert into tborderdetail
        for (const item of items) {
            await connection.query(
                'INSERT INTO tborderdetail (orderid, menuid, quantity, special_note) VALUES (?, ?, ?, ?)',
                [orderid, item.menuid, item.quantity, item.special_note || null]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order created', orderid });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        connection.release();
    }
});

// 6. Update order status (by Chef)
router.put('/orders/:id/status', async (req, res) => {
    const { status } = req.body; // 'กำลังทำ' or 'เสร็จสิ้น'
    const validStatuses = ['รอคิว', 'กำลังทำ', 'เสร็จสิ้น'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        let query = 'UPDATE tborder SET orderstatus = ?';
        const params = [status];

        if (status === 'กำลังทำ') {
            query += ', start_at = CURRENT_TIMESTAMP';
        } else if (status === 'เสร็จสิ้น') {
            query += ', finish_at = CURRENT_TIMESTAMP';
        }

        query += ' WHERE orderid = ?';
        params.push(req.params.id);

        const [result] = await db.query(query, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
