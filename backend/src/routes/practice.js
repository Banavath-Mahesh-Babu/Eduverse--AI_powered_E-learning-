
import express from 'express'
import { PracticePaper } from '../models/PracticePaper.js'
import { requireAuth } from '../middleware/auth.js'
export const practiceRouter = express.Router()
practiceRouter.get('/practice-papers', requireAuth, async (req,res)=>{const{category,q,course}=req.query;const f={};if(category)f.category=category;if(course)f.course=course;if(q)f.title={$regex:q,$options:'i'};res.json(await PracticePaper.find(f).sort({createdAt:-1}))})
practiceRouter.get('/practice-papers/:id', requireAuth, async (req,res)=>{const it=await PracticePaper.findById(req.params.id);if(!it)return res.status(404).json({error:'Practice paper not found'});res.json(it)})
practiceRouter.post('/practice-papers/:id/submit', requireAuth, async (req,res)=>{const it=await PracticePaper.findById(req.params.id);if(!it)return res.status(404).json({error:'Practice paper not found'});const answers=Array.isArray(req.body.answers)?req.body.answers:[];let score=0;it.questions.forEach((q,i)=>{if(answers[i]===q.answerIndex)score++});res.json({total:it.questions.length,correct:score,percentage:Math.round(score*100/it.questions.length)})})
