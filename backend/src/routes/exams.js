
import express from 'express'
import { Exam } from '../models/Exam.js'
import { requireAuth } from '../middleware/auth.js'
export const examsRouter = express.Router()
examsRouter.get('/exams', requireAuth, async (req,res)=>{const{category,q,course}=req.query;const f={};if(category)f.category=category;if(course)f.course=course;if(q)f.title={$regex:q,$options:'i'};res.json(await Exam.find(f).sort({createdAt:-1}))})
examsRouter.get('/exams/:id', requireAuth, async (req,res)=>{const it=await Exam.findById(req.params.id);if(!it)return res.status(404).json({error:'Exam not found'});res.json(it)})
examsRouter.post('/exams/:id/submit', requireAuth, async (req,res)=>{const it=await Exam.findById(req.params.id);if(!it)return res.status(404).json({error:'Exam not found'});const answers=Array.isArray(req.body.answers)?req.body.answers:[];let score=0;it.questions.forEach((q,i)=>{if(answers[i]===q.answerIndex)score++});res.json({total:it.questions.length,correct:score,percentage:Math.round(score*100/it.questions.length)})})
