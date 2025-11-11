import React, { useEffect, useState } from 'react'
import { getCourses } from '../services/api.js'
import CategoryTabs from '../components/CategoryTabs.jsx'
import CourseCard from '../components/CourseCard.jsx'
import CourseCardRich from '../components/CourseCardRich.jsx'

export default function Courses() {
    const [category, setCategory] = useState('all')
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [q, setQ] = useState('')

    useEffect(() => {
        ; (async () => {
            setLoading(true)
            const p = {}
            if (category !== 'all') p.category = category
            if (q) p.q = q
            const { data } = await getCourses(p)
            setCourses(data)
            setLoading(false)
        })()
    }, [category, q])

    return (
        <section className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <h2 className="text-2xl font-bold">Courses</h2>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search courses..." className="px-3 py-2 rounded-xl border w-full sm:w-64 min-w-0" />
                    <CategoryTabs value={category} onChange={setCategory} />
                </div>
            </div>

            {loading ? (
                <p className="mt-10 text-gray-600">Loading…</p>
            ) : (
                <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((c) => (
                        (c.category === 'literature' || c.category === 'business' || c.category === 'computers')
                            ? <CourseCardRich key={c._id} course={c} />
                            : <CourseCard key={c._id} course={c} />
                    ))}
                </div>
            )}
        </section>
    )
}