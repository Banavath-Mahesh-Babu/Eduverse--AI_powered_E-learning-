
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import { authRouter } from './routes/auth.js'
import { router as courseRouter } from './routes/courses.js'
import { examsRouter } from './routes/exams.js'
import { practiceRouter } from './routes/practice.js'
import { aiRouter } from './routes/ai.js'
import { autoSeed } from './autoSeed.js'
// Load .env and FORCE override so the local .env value wins during development
dotenv.config({ override: true })
const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }))
app.get('/api/health', (_req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))
app.use('/api', authRouter)
app.use('/api', courseRouter)
app.use('/api', examsRouter)
app.use('/api', practiceRouter)
app.use('/api', aiRouter)
const PORT = process.env.PORT || 5000

// Log a masked preview of the OpenAI key on startup to help debug env issues (masked locally)
const openaiPreview = process.env.OPENAI_API_KEY ? (process.env.OPENAI_API_KEY.slice(0, 8) + '...' + process.env.OPENAI_API_KEY.slice(-4)) : null
if (openaiPreview) console.log('🔐 OPENAI_API_KEY preview:', openaiPreview)
const MONGO = process.env.MONGO_URI
if (!MONGO) { console.error('Missing MONGO_URI'); process.exit(1) }
connectDB(MONGO).then(async () => { await autoSeed(); app.listen(PORT, () => console.log(`🚀 Backend http://localhost:${PORT}`)) })
