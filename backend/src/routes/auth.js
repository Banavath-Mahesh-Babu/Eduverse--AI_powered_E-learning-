
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
export const authRouter = express.Router()

authRouter.post('/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, passwordHash })
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: process.env.TOKEN_EXPIRE || '2d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) { res.status(500).json({ error: 'Signup failed' }) }
})

authRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) return res.status(400).json({ error: 'Email & password required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET || 'devsecret', { expiresIn: process.env.TOKEN_EXPIRE || '2d' })
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (e) { res.status(500).json({ error: 'Login failed' }) }
})

authRouter.get('/auth/profile', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id).select('_id name email createdAt')
  res.json({ user })
})

// Debug route: verifies Authorization header and returns token payload if valid
authRouter.get('/auth/debug', async (req, res) => {
  try {
    const h = req.headers.authorization || ''
    const t = h.startsWith('Bearer ') ? h.slice(7) : null
    if (!t) return res.json({ ok: true, hasAuthHeader: false })
    try {
      const payload = jwt.verify(t, process.env.JWT_SECRET || 'devsecret')
      return res.json({ ok: true, hasAuthHeader: true, valid: true, payload })
    } catch (e) {
      return res.json({ ok: true, hasAuthHeader: true, valid: false, error: e.message })
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'debug-failed' })
  }
})
