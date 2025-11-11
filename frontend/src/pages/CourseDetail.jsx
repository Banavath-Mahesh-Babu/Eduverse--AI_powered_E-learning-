
import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCourseById, askAI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
export default function CourseDetail() {
  const { id } = useParams(); const [course, setCourse] = useState(null); const [loading, setLoading] = useState(true)
  const [q, setQ] = useState(''); const [a, setA] = useState(''); const { token } = useAuth()
  useEffect(() => { (async () => { const { data } = await getCourseById(id); setCourse(data); setLoading(false) })() }, [id])
  async function ask() { if (!token) { alert('Login to use AI'); return } const { data } = await askAI({ question: q, context: { type: 'course', id } }); setA(data.answer) }
  if (loading) return <div className='max-w-4xl mx-auto px-4 py-10'>Loading…</div>
  if (!course) return <div className='max-w-4xl mx-auto px-4 py-10'>Not found</div>
  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/courses" className="text-sm text-gray-600">← Back</Link>
      <div className="mt-3 rounded-2xl overflow-hidden border bg-white shadow-sm">
        {course.thumbnail ? <img src={course.thumbnail} alt={course.title} className="w-full h-40 sm:h-56 object-cover" /> : <div className="h-40 sm:h-56 bg-gray-200" />}
        <div className="p-6 space-y-3">
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <div className="flex gap-2 text-xs text-gray-700">
            <span className="px-2 py-0.5 bg-gray-100 rounded-full">{course.category}</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded-full">{course.level}</span>
            <span>⭐ {course.rating} • {course.learners} learners • {course.duration}</span>
          </div>

          {course.thesis && (
            <div className="mt-3 p-4 bg-sky-50 border-l-4 border-sky-200 rounded">
              <h3 className="text-md font-semibold text-sky-700">Course thesis</h3>
              <p className="text-sm text-gray-700 mt-2">{course.thesis}</p>
            </div>
          )}

          <p className="text-gray-700">{course.summary}</p>

          {course.description && (
            <div>
              <h3 className="text-lg font-semibold mt-4">Course description</h3>
              <p className="text-gray-700 mt-2">{course.description}</p>
            </div>
          )}

          {course.resources?.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mt-4">Resources</h3>
              <ul className="mt-2 list-disc list-inside text-sm text-blue-600">
                {course.resources.map((r, i) => (
                  <li key={i}><a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">{r.title}</a></li>
                ))}
              </ul>
            </div>
          )}

          <h3 className="text-lg font-semibold mt-4">Lessons</h3>
          <ol className="space-y-3 list-decimal ml-5">
            {course.lessons?.map((l, i) => (
              <li key={i} className="bg-gray-50 rounded-xl p-3 border">
                <p className="font-medium">{l.title}</p>
                {l.videoUrl && (
                  <div className="mt-2 aspect-video">
                    <iframe className="w-full h-full" src={l.videoUrl} title={l.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                  </div>
                )}
                {l.content && <p className="text-sm text-gray-700 mt-2">{l.content}</p>}
                {l.resources?.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-sm text-blue-600">
                    {l.resources.map((r, idx) => (
                      <li key={idx}><a href={r.url} target="_blank" rel="noreferrer" className="hover:underline">{r.title}</a></li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold">Ask AI about this course</h3>
            <div className="mt-2 flex flex-col sm:flex-row gap-2">
              <input value={q} onChange={e => setQ(e.target.value)} className="border rounded-xl px-3 py-2 flex-1" placeholder="Type a question…" />
              <button onClick={ask} className="px-4 py-2 rounded-xl bg-black text-white w-full sm:w-auto">Ask AI</button>
            </div>
            {a && <pre className="mt-3 bg-gray-50 p-3 rounded-xl border whitespace-pre-wrap">{a}</pre>}
          </div>
        </div>
      </div>
    </section>
  )

}
