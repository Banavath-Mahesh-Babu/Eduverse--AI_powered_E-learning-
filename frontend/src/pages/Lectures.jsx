
import React, { useEffect, useState } from 'react'
import { getCourses, askAI } from '../services/api.js'
import CategoryTabs from '../components/CategoryTabs.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Lectures() {
  const [category, setCategory] = useState('all')
  const [courses, setCourses] = useState([])
  const [sel, setSel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    (async () => {
      setLoading(true)
      const p = {}; if (category !== 'all') p.category = category
      const { data } = await getCourses(p)
      setCourses(data); setSel(data[0] || null); setLoading(false)
    })()
  }, [category])

  async function ask() {
    if (!token) { alert('Login to use AI'); return }
    if (!sel) return
    const { data } = await askAI({ question: q, context: { type: 'lecture', id: sel._id } })
    setA(data.answer)
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold">Lectures</h2>
        <CategoryTabs value={category} onChange={setCategory} />
      </div>
      {loading ? <p className="mt-10 text-gray-600">Loading…</p> : (
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            {courses.map(c => (
              <button key={c._id} onClick={() => setSel(c)} className={`w-full text-left px-3 py-2 rounded-xl border ${sel?._id === c._id ? 'border-black bg-white' : 'border-gray-300 bg-gray-50'}`}>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-gray-600">{c.category}</p>
              </button>
            ))}
          </div>
          <div className="md:col-span-2">
            {!sel ? <p>Select a course</p> : (
              <div className="rounded-2xl border bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold">{sel.title}</h3>
                {sel.resources?.length > 0 && (
                  <div className="mt-3">
                    <h4 className="font-semibold">Resources</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-blue-600">
                      {sel.resources.map((r, idx) => (
                        <li key={idx}><a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">{r.title}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                <ol className="mt-3 space-y-3 list-decimal ml-5">
                  {sel.lessons?.map((l, i) => (
                    <li key={i} className="bg-gray-50 rounded-xl p-3 border">
                      <p className="font-medium">{l.title}</p>
                      {l.videoUrl && <div className="mt-2 aspect-video"><iframe className="w-full h-full" src={l.videoUrl} title={l.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe></div>}
                      {l.content && <p className="text-sm text-gray-700 mt-2">{l.content}</p>}
                      {l.resources?.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-sm font-medium">Lesson resources</h5>
                          <ul className="mt-1 list-disc list-inside text-sm text-blue-600">
                            {l.resources.map((r, j) => (
                              <li key={j}><a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">{r.title}</a></li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold">Ask AI about this lecture/course</h4>
                  <div className="mt-2 flex gap-2">
                    <input value={q} onChange={e => setQ(e.target.value)} className="border rounded-xl px-3 py-2 flex-1" placeholder="Type a question…" />
                    <button onClick={ask} className="px-4 py-2 rounded-xl bg-black text-white">Ask AI</button>
                  </div>
                  {a && <pre className="mt-3 bg-gray-50 p-3 rounded-xl border whitespace-pre-wrap">{a}</pre>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
