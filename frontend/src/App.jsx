
import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Courses from './pages/Courses.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import Lectures from './pages/Lectures.jsx'
import Exams from './pages/Exams.jsx'
import ExamDetail from './pages/ExamDetail.jsx'
import Practice from './pages/Practice.jsx'
import PracticeDetail from './pages/PracticeDetail.jsx'
import AiAssistant from './pages/AiAssistant.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AIAssistantWidget from './components/AIAssistantWidget.jsx'
export default function App() {
  const loc = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-sky-50 via-white to-white">
      <Navbar />
      <main className="flex-1">
        {/* page transition: fade-in on route change */}
        <div key={loc.pathname} className="transition-opacity duration-400 ease-in-out opacity-0 animate-fadeIn">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/lectures" element={<Lectures />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
            <Route path="/exam/:id" element={<ProtectedRoute><ExamDetail /></ProtectedRoute>} />
            <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
            <Route path="/practice/:id" element={<ProtectedRoute><PracticeDetail /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistant /></ProtectedRoute>} />
          </Routes>
        </div>
      </main>
      <AIAssistantWidget />
      <Footer />
    </div>
  )
}
