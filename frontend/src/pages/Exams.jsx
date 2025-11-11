
import React,{useEffect,useState} from 'react'
import {getExams} from '../services/api.js'
import {Link} from 'react-router-dom'
import CourseFilter from '../components/CourseFilter.jsx'
export default function Exams(){
  const [category,setCategory]=useState('all')
  const [course,setCourse]=useState('')
  const [items,setItems]=useState([])
  const [q,setQ]=useState('')
  const [loading,setLoading]=useState(true)
  useEffect(()=>{(async()=>{
    setLoading(true)
    const p={}; if(category!=='all') p.category=category; if(course) p.course=course; if(q) p.q=q
    const {data}=await getExams(p); setItems(data); setLoading(false)
  })()},[category,course,q])
  return(<section className='max-w-6xl mx-auto px-4 py-10'><div className='flex items-center justify-between gap-4 flex-wrap'><h2 className='text-2xl font-bold'>Exams</h2><div className='flex items-center gap-3'><input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search exams...' className='px-3 py-2 rounded-xl border'/><CourseFilter category={category} course={course} onCategory={setCategory} onCourse={setCourse}/></div></div>{loading?<p className='mt-10 text-gray-600'>Loading…</p>:(<div className='mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>{items.map(it=>(<Link key={it._id} to={`/exam/${it._id}`} className='block rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md'><h3 className='font-semibold'>{it.title}</h3><p className='text-sm text-gray-600 mt-1'>Duration: {it.durationMinutes} min</p><p className='text-xs text-gray-500 mt-1'>Category: {it.category}</p></Link>))}</div>)}</section>)}
