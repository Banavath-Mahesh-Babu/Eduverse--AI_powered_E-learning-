import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
    const { user } = useAuth()
    const bg = 'https://media.istockphoto.com/id/1059510610/vector/it-communication-e-learning-internet-network-as-knowledge-base.jpg?s=612x612&w=0&k=20&c=QEyHx6JnZleLmW9lYgpzvLv765rizr__5zwwKylo300='

    const AuthHero = (
        <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">AI‑Powered Learning. Exam‑Ready.</h1>
                <p className="mt-4 text-gray-200 text-lg">Lectures (open), plus Exams, Practice & AI for signed in users.</p>
                <div className="mt-6 flex gap-3">
                    <Link to="/courses" className="px-5 py-2.5 rounded-xl bg-white text-black">Browse Courses</Link>
                    <Link to="/exams" className="px-5 py-2.5 rounded-xl bg-transparent border text-white">Exams</Link>
                </div>
            </div>
            <div className="h-64 md:h-80 rounded-3xl bg-white/10 border border-white/10 shadow flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-5xl">🎓</div>
                    <p className="mt-3 text-gray-200">Welcome back — explore your learning dashboard</p>
                </div>
            </div>
        </div>
    )

    const GuestHero = (
        <div className="min-h-[70vh] flex items-center py-12">
            <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-white">Welcome to Eduverse</h1>
                    <p className="text-lg text-gray-200 max-w-xl leading-relaxed">Fast, modern learning with curated courses, timed exams and AI assistance. Sign in or create an account to get started — your progress will be saved and synchronized across devices.</p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4">
                        <Link to="/courses" className="inline-flex items-center justify-center min-w-[180px] px-6 py-4 rounded-2xl bg-white/10 border text-white shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5">Browse public courses</Link>
                        <Link to="/login" className="inline-flex items-center justify-center min-w-[160px] px-6 py-4 rounded-2xl bg-black text-white shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5">Sign in</Link>
                        <Link to="/signup" className="inline-flex items-center justify-center min-w-[160px] px-6 py-4 rounded-2xl bg-white text-black shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5">Create account</Link>
                    </div>
                </div>

                <div className="bg-white/5 p-10 rounded-3xl shadow-lg flex items-center justify-center">
                    <div className="text-center max-w-sm text-white">
                        <div className="text-6xl">🎓</div>
                        <p className="mt-6 text-gray-200 text-lg">Create an account to save progress and access exams and AI features.</p>
                    </div>
                </div>
            </div>
        </div>
    )

    const AboutBlock = (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-sky-800">About Eduverse</h2>
                <p className="mt-3 text-gray-700">Eduverse is an experimental learning platform that combines curated course content, practice exams, and an AI assistant to help learners study smarter. It's designed to be lightweight, accessible, and exam-focused so learners can move from understanding to mastery.</p>

                <h3 className="mt-6 text-lg font-semibold text-sky-700">The gap we're addressing</h3>
                <ul className="mt-3 list-disc list-inside text-gray-700 space-y-2">
                    <li><strong>Fragmented resources:</strong> Educational content is scattered across websites and videos. Eduverse centralizes curated readings, tools, and context-sensitive YouTube resources so learners spend less time searching and more time learning.</li>
                    <li><strong>Insufficient assessment:</strong> Many platforms lack integrated practice tests. We provide timed exams and practice papers that mimic real test conditions and give actionable feedback.</li>
                    <li><strong>Integrated AI guidance:</strong> A context-aware AI assistant offers on-demand explanations, concise summaries, and step-by-step walkthroughs tied to the current page or selected text—so learners get help exactly when they need it.</li>
                    <li><strong>Automatic practice & personalization:</strong> The AI can generate practice questions, quizzes, and revision prompts tailored to a course or lesson, and suggest study paths based on progress and weak areas.</li>
                    <li><strong>Access & cost:</strong> High-quality courses can be expensive. Eduverse focuses on compact, high-value content and links to freely available primary texts, readings, and videos where possible.</li>
                </ul>

                <div className="mt-6 flex gap-3">
                    <Link to="/courses" className="px-4 py-2 rounded-lg bg-sky-700 text-white">Browse courses</Link>
                    <Link to="/lectures" className="px-4 py-2 rounded-lg border border-sky-100 text-sky-700">View lectures</Link>
                </div>
            </div>
        </div>
    )

    return (
        <section className="relative overflow-hidden">
            {/* Background image */}
            <img src={bg} alt="background" className="absolute inset-0 w-full h-full object-cover filter blur-sm brightness-75" />
            <div className="absolute inset-0 bg-black/30 z-10" />
            <div className="absolute inset-x-0 bottom-0 h-48 z-20" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.98) 100%)' }} />

            <div className="relative z-30">
                {user ? AuthHero : GuestHero}
                {AboutBlock}
            </div>
        </section>
    )
}