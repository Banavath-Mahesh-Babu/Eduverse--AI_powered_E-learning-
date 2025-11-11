
import React,{useEffect,useState} from 'react'
import {useParams,Link} from 'react-router-dom'
import {getExamById,submitExam,askAI} from '../services/api.js'
export default function ExamDetail(){
  const {id}=useParams()
  const [exam,setExam]=useState(null)
  const [answers,setAnswers]=useState([])
  const [result,setResult]=useState(null)
  const [loading,setLoading]=useState(true)
  const [q,setQ]=useState('')
  const [a,setA]=useState('')
  useEffect(()=>{(async()=>{const{data}=await getExamById(id);setExam(data);setAnswers(new Array(data.questions.length).fill(null));setLoading(false)})()},[id])
  async function submit(){const{data}=await submitExam(id,answers);setResult(data)}
  async function ask(){const{data}=await askAI({question:q,context:{type:'exam',id}});setA(data.answer)}
  if(loading)return<div className='max-w-4xl mx-auto px-4 py-10'>Loading…</div>
  if(!exam)return<div className='max-w-4xl mx-auto px-4 py-10'>Not found</div>
  return(<section className='max-w-4xl mx-auto px-4 py-10'><Link to='/exams' className='text-sm text-gray-600'>← Back</Link><h1 className='text-2xl font-bold mt-2'>{exam.title}</h1><p className='text-sm text-gray-600'>Duration: {exam.durationMinutes} min • Category: {exam.category}</p><ol className='mt-6 space-y-4 list-decimal ml-5'>{exam.questions.map((qq,i)=>(<li key={i} className='bg-white border rounded-xl p-4'><p className='font-medium'>{qq.question}</p><div className='mt-2 grid sm:grid-cols-2 gap-2'>{qq.options.map((op,j)=>(<label key={j} className={`border rounded-lg p-2 cursor-pointer ${answers[i]===j?'border-black':'border-gray-300'}`}><input type='radio' name={`q${i}`} className='mr-2' checked={answers[i]===j} onChange={()=>{const c=[...answers];c[i]=j;setAnswers(c)}}/>{op}</label>))}</div></li>))}</ol><button onClick={submit} className='mt-6 px-5 py-2 rounded-xl bg-black text-white'>Submit</button>{result&&(<div className='mt-6 bg-gray-50 border rounded-xl p-5'><p className='font-semibold'>Result</p><p className='text-gray-700'>Score: {result.correct} / {result.total} ({result.percentage}%)</p></div>)}<div className='mt-8 border-t pt-6'><h3 className='font-semibold'>Ask AI about this exam</h3><div className='mt-2 flex gap-2'><input value={q} onChange={e=>setQ(e.target.value)} className='border rounded-xl px-3 py-2 flex-1' placeholder='Type a question…'/><button onClick={ask} className='px-4 py-2 rounded-xl bg-black text-white'>Ask AI</button></div>{a&&<pre className='mt-3 bg-gray-50 p-3 rounded-xl border whitespace-pre-wrap'>{a}</pre>}</div></section>)}
