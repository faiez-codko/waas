const express = require('express');
const router = express.Router();
const db = require('./db');

// Get all payment methods (Public/User)
router.get('/', async (req, res) => {
  try {
    const r = await db.pool.query('SELECT * FROM payment_methods WHERE is_active = 1 ORDER BY created_at DESC');
    res.json({ paymentMethods: r.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Admin: Get all payment methods (including inactive)
router.get('/admin', async (req, res) => {
  try {
    const r = await db.pool.query('SELECT * FROM payment_methods ORDER BY created_at DESC');
    res.json({ paymentMethods: r.rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Admin: Create payment method
router.post('/admin', async (req, res) => {
  try {
    const { title, type, details, instructions, is_active } = req.body;
    if (!title || !type) return res.status(400).json({ error: 'Title and type are required' });

    const id = require('uuid').v4();
    await db.pool.query(
      'INSERT INTO payment_methods (id, title, type, details, instructions, is_active) VALUES ($1, $2, $3, $4, $5, $6)',
      [id, title, type, details, instructions, is_active ? 1 : 0]
    );

    res.json({ ok: true, id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Admin: Update payment method
router.put('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, type, details, instructions, is_active } = req.body;
    
    await db.pool.query(
      'UPDATE payment_methods SET title=$1, type=$2, details=$3, instructions=$4, is_active=$5 WHERE id=$6',
      [title, type, details, instructions, is_active ? 1 : 0, id]
    );

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// Admin: Delete payment method
router.delete('/admin/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.pool.query('DELETE FROM payment_methods WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
