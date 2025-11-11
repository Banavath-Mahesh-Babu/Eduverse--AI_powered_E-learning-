
import express from 'express'
import dotenv from 'dotenv'
import { CourseModel } from '../models/Course.js'
import { Exam } from '../models/Exam.js'
import { PracticePaper } from '../models/PracticePaper.js'
import { requireAuth } from '../middleware/auth.js'
dotenv.config()
export const aiRouter = express.Router()
aiRouter.post('/ask-ai', requireAuth, async (req, res) => {
  try {
    const { question, context } = req.body || {}
    if (!question?.trim()) return res.status(400).json({ error: 'Question is required' })
    if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: 'Missing OPENAI_API_KEY on server' })
    let ctx = ''
    if (context?.type && context?.id) {
      if (['lecture', 'course'].includes(context.type)) { const c = await CourseModel.findById(context.id); if (c) ctx = `Course: ${c.title} [${c.category}]` }
      else if (context.type === 'exam') { const e = await Exam.findById(context.id); if (e) ctx = `Exam: ${e.title} in ${e.category}` }
      else if (context.type === 'practice') { const p = await PracticePaper.findById(context.id); if (p) ctx = `Practice: ${p.title} in ${p.category}` }
    }

    // Helper to call OpenAI and parse response
    const callOpenAI = async (model) => {
      const payload = { model, messages: [{ role: 'system', content: 'You are Eduverse AI Assistant. Explain clearly with steps, examples, and formulas when helpful.' }, ...(ctx ? [{ role: 'system', content: 'Context:\n' + ctx }] : []), { role: 'user', content: question }], temperature: 0.4, max_tokens: 700 }
      const r = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify(payload) })
      const text = await r.text()
      let parsed = null
      try { parsed = JSON.parse(text) } catch (e) { /* not JSON */ }
      return { ok: r.ok, status: r.status, text, json: parsed }
    }

    const preferred = process.env.AI_MODEL || 'gpt-4o-mini'
    const fallback = process.env.AI_MODEL_FALLBACK || 'gpt-3.5-turbo'

    // Try preferred model first
    let result = await callOpenAI(preferred)
    // If quota or billing error, try fallback model automatically
    if (!result.ok) {
      const code = result.json?.error?.code || ''
      const type = result.json?.error?.type || ''
      console.warn('[ai] OpenAI call failed', { status: result.status, type, code })
      // insufficient_quota or billing problems -> try fallback
      if (type === 'insufficient_quota' || code === 'insufficient_quota' || result.status === 402) {
        console.log('[ai] insufficient_quota detected — retrying with fallback model', fallback)
        result = await callOpenAI(fallback)
      }
    }

    if (!result.ok) {
      // Try to surface helpful guidance for common OpenAI errors
      const errType = result.json?.error?.type || ''
      const errCode = result.json?.error?.code || ''
      const details = result.text
      if (errType === 'insufficient_quota' || errCode === 'insufficient_quota' || result.status === 402 || result.status === 429) {
        return res.status(402).json({ error: 'insufficient_quota', message: 'OpenAI reports insufficient quota or billing issue. Please check your OpenAI account billing/usage or use a different API key.', docs: 'https://platform.openai.com/account/usage', details })
      }
      return res.status(result.status || 500).json({ error: 'OpenAI error', details })
    }
    const j = result.json
    return res.json({ answer: j?.choices?.[0]?.message?.content || 'No response.' })
  } catch (e) { console.error(e); res.status(500).json({ error: 'AI service error' }) }
})

// Lightweight health check for AI configuration
aiRouter.get('/ai-health', async (req, res) => {
  try {
    const keySet = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim())
    const preview = keySet ? (process.env.OPENAI_API_KEY.slice(0, 10) + '...') : null
    // Optional probe: ?probe=1 will attempt a quick call to OpenAI models endpoint and return status/details
    if (req.query.probe && keySet) {
      try {
        const r = await fetch('https://api.openai.com/v1/models', { headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 5000 })
        const text = await r.text()
        return res.json({ ok: true, openai_key_set: true, key_preview: preview, probe: { status: r.status, body: text } })
      } catch (e) {
        return res.json({ ok: false, openai_key_set: keySet, key_preview: preview, probe: { error: String(e) } })
      }
    }
    return res.json({ ok: true, openai_key_set: keySet, key_preview: preview })
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'ai-health-failed' })
  }
})
