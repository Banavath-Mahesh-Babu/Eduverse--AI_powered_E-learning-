
import React,{useState} from 'react'
import {askAI} from '../services/api.js'
export default function AiAssistant(){
  const [q,setQ]=useState('')
  const [a,setA]=useState('')
  const [loading,setLoading]=useState(false)
  async function handleAsk(){
    if(!q.trim())return
    setLoading(true)
    try{const{data}=await askAI({question:q});setA(data.answer)}catch{setA('⚠️ Error contacting AI. Check backend key.')}
    finally{setLoading(false)}
  }
  return(<section className='max-w-3xl mx-auto px-4 py-10'><h2 className='text-3xl font-bold'>Eduverse AI Assistant 🤖</h2><p className='text-gray-700 mt-2'>Ask doubts from Literature, Business, or Computer Science (login required).</p><div className='mt-6 flex gap-3'><input className='flex-1 border px-4 py-2 rounded-xl' placeholder='Type your question...' value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&handleAsk()}/><button onClick={handleAsk} disabled={loading} className='px-5 py-2 rounded-xl bg-black text-white'>{loading?'Thinking…':'Ask AI'}</button></div>{a&&(<div className='mt-6 bg-gray-50 border rounded-xl p-5 shadow-sm'><h3 className='font-semibold text-lg mb-2'>AI Response</h3><pre className='whitespace-pre-wrap text-gray-900'>{a}</pre></div>)}</section>)}
