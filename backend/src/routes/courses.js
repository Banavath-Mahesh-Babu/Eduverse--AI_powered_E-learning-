
import express from 'express'
import { CourseModel } from '../models/Course.js'
export const router = express.Router()
router.get('/categories',(_req,res)=>res.json([{id:'literature',name:'Literature'},{id:'business',name:'Business Studies'},{id:'computers',name:'Computer Science'}]))
router.get('/courses',async(req,res)=>{const{category,q}=req.query;const f={};if(category)f.category=category;if(q)f.title={$regex:q,$options:'i'};res.json(await CourseModel.find(f).sort({createdAt:-1}))})
router.get('/courses/:id',async(req,res)=>{const c=await CourseModel.findById(req.params.id);if(!c)return res.status(404).json({error:'Course not found'});res.json(c)})
