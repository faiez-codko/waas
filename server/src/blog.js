const express = require('express')
const router = express.Router()
const db = require('./db')
const { v4: uuidv4 } = require('uuid')
const auth = require('./auth')

// Public routes
router.get('/', async (req, res) => {
  try {
    const { limit = 10, offset = 0 } = req.query
    const r = await db.pool.query(
      "SELECT id, title, slug, excerpt, category, read_time, author_name, author_role, published_at, created_at, status FROM posts WHERE status = 'Published' ORDER BY published_at DESC LIMIT $1 OFFSET $2",
      [limit, offset]
    )
    res.json({ posts: r.rows })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    // Try by ID first, then slug
    let r = await db.pool.query('SELECT * FROM posts WHERE id=$1', [id])
    if (!r.rows.length) {
      r = await db.pool.query('SELECT * FROM posts WHERE slug=$1', [id])
    }
    
    if (!r.rows.length) return res.status(404).json({ error: 'Post not found' })
    res.json({ post: r.rows[0] })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

// Admin routes (protected)

router.get('/admin/list', auth.verifyToken, auth.requireRole('admin'), async (req, res) => {
  try {
    const { limit = 100, offset = 0 } = req.query
    const r = await db.pool.query(
      'SELECT * FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    )
    res.json({ posts: r.rows })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.post('/', auth.verifyToken, auth.requireRole('admin'), async (req, res) => {
  try {
    const { title, slug, excerpt, content, category, read_time, author_name, author_role, published_at, status } = req.body
    const id = uuidv4()
    // default published_at to now if not provided
    const pubDate = published_at || new Date().toISOString()
    
    // simple slug generation if missing
    let finalSlug = slug
    if (!finalSlug && title) {
      finalSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    if (!finalSlug) finalSlug = id

    await db.pool.query(
      'INSERT INTO posts (id, title, slug, excerpt, content, category, read_time, author_name, author_role, published_at, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [id, title, finalSlug, excerpt, content, category, read_time, author_name, author_role, pubDate, status || 'Draft']
    )
    res.json({ ok: true, id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.put('/:id', auth.verifyToken, auth.requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params
    const { title, slug, excerpt, content, category, read_time, author_name, author_role, published_at, status } = req.body
    
    await db.pool.query(
      'UPDATE posts SET title=$1, slug=$2, excerpt=$3, content=$4, category=$5, read_time=$6, author_name=$7, author_role=$8, published_at=$9, status=$10 WHERE id=$11',
      [title, slug, excerpt, content, category, read_time, author_name, author_role, published_at, status, id]
    )
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

router.delete('/:id', auth.verifyToken, auth.requireRole('admin'), async (req, res) => {
  try {
    const { id } = req.params
    await db.pool.query('DELETE FROM posts WHERE id=$1', [id])
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: e.message })
  }
})

module.exports = router
