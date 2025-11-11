import React from 'react'
import { Link } from 'react-router-dom'

export default function CourseCard({ course }) {
    const excerpt = course.description || course.summary || ''
    const hasResources = (course.resources && course.resources.length > 0) || (course.lessons && course.lessons.some(l => l.resources && l.resources.length > 0))
    return (
        <Link to={`/courses/${course._id}`} className="block group">
            <div className="rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-md">
                <div className="relative">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full object-cover h-36 sm:h-40 md:h-44"
                        onError={(e) => {
                            // fallback: generate simple SVG data URL with course title
                            try {
                                const title = course.title || 'Course'
                                const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='54%' font-family='Segoe UI, Arial, sans-serif' font-size='28' fill='#0f172a' font-weight='600' text-anchor='middle' dominant-baseline='middle'>${title}</text></svg>`
                                e.currentTarget.onerror = null
                                e.currentTarget.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
                            } catch (err) {
                                // noop
                            }
                        }}
                    />
                    {hasResources && (
                        <div title="Has resources" className="absolute right-2 top-2 bg-white/90 rounded-full p-1 shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-indigo-600">
                                <path d="M12 2a2 2 0 00-2 2v8a4 4 0 11-4 4h2a2 2 0 102 2 6 6 0 006-6V4a2 2 0 00-2-2h-2z" />
                            </svg>
                        </div>
                    )}
                </div>
                <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold group-hover:underline">{course.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{course.category}</span>
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full">{course.level}</span>
                        <span>⭐ {course.rating} · {course.learners} learners</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-3">{excerpt}</p>
                </div>
            </div>
        </Link>
    )
}