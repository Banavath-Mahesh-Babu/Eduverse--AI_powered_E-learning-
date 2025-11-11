import React, { useEffect, useState } from 'react'
import CategoryTabs from './CategoryTabs'
import { getCourses } from '../services/api.js'

export default function CourseFilter({ category = 'all', course = '', onCategory = () => { }, onCourse = () => { } }) {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true
            ; (async () => {
                try {
                    setLoading(true)
                    const params = {}
                    if (category && category !== 'all') params.category = category
                    const { data } = await getCourses(params)
                    if (mounted) setCourses(data)
                } catch (err) {
                    console.error('Failed to load courses', err)
                } finally {
                    if (mounted) setLoading(false)
                }
            })()
        return () => (mounted = false)
    }, [category])

    return (
        <div className="flex items-center gap-3">
            <div className="hidden sm:block">
                <CategoryTabs value={category} onChange={onCategory} />
            </div>
            <select
                value={course}
                onChange={(e) => onCourse(e.target.value)}
                className="px-3 py-2 rounded-xl border bg-white"
            >
                <option value="">All courses</option>
                {loading && <option>Loading...</option>}
                {!loading && courses.map((c) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                ))}
            </select>
        </div>
    )
}
