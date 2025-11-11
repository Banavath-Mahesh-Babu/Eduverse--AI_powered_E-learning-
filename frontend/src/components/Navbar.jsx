
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
const Nav = ({ to, children }) => {
  const { pathname } = useLocation()
  const a = pathname === to
  return (
    <Link to={to} className="relative px-2 md:px-3 py-1 md:py-2 rounded-lg text-sm inline-flex flex-col items-center group whitespace-nowrap">
      <span className={`transition-colors duration-200 ${a ? 'text-sky-900 font-semibold' : 'text-sky-700 group-hover:text-sky-800'}`}>{children}</span>
      {/* underline bar that animates width */}
      <span className={`block h-0.5 bg-brand mt-1 transition-all duration-300 ${a ? 'w-full' : 'w-0 group-hover:w-6 md:group-hover:w-8'}`} />
    </Link>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  function onLogout() { logout(); nav('/') }
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-sky-100">
      <div className="max-w-6xl mx-auto px-4 py-3 relative flex items-center justify-between">
        <div className="flex-none flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="-ml-1">
              <circle cx="12" cy="12" r="10" fill="#0ea5e9" />
              <path d="M7 12c1.5-3 5-3 6 0" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-extrabold text-sky-700 tracking-tight">Eduverse</span>
          </Link>
        </div>

        {/* centered nav - appears from small screens upward, stays centered */}
        <div className="hidden sm:flex flex-1 justify-center">
          <nav className="flex items-center gap-3 overflow-x-auto no-scrollbar px-2">
            <Nav to="/">Home</Nav>
            <Nav to="/courses">Courses</Nav>
            <Nav to="/lectures">Lectures</Nav>
            <Nav to="/exams">Exams</Nav>
            <Nav to="/practice">Practice</Nav>
            <Nav to="/ai-assistant">AI Assistant</Nav>
          </nav>
        </div>

        <div className="flex-none flex items-center gap-3">
          {/* user area for sm+ */}
          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-semibold">{(user.name || 'U').charAt(0)}</div>
                  <div className="text-sm">
                    <div className="text-xs text-gray-500">Hi,</div>
                    <div className="text-sm text-sky-700 font-medium">{user.name}</div>
                  </div>
                </div>
                <button onClick={onLogout} className="px-3 py-1.5 rounded-full border border-sky-200 text-sky-700 hover:bg-sky-50">Logout</button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm text-sky-700 hover:underline">Login</Link>
                <Link to="/signup" className="text-sm px-3 py-1 rounded-full bg-sky-700 text-white">Signup</Link>
              </div>
            )}
          </div>

          {/* mobile menu button */}
          <button onClick={() => setMobileOpen(v => !v)} className="sm:hidden p-2 rounded-md border border-sky-100">
            <svg className="w-5 h-5 text-sky-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* mobile panel */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-sky-50">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="py-2">Home</Link>
            <Link to="/courses" onClick={() => setMobileOpen(false)} className="py-2">Courses</Link>
            <Link to="/lectures" onClick={() => setMobileOpen(false)} className="py-2">Lectures</Link>
            <Link to="/exams" onClick={() => setMobileOpen(false)} className="py-2">Exams</Link>
            <Link to="/practice" onClick={() => setMobileOpen(false)} className="py-2">Practice</Link>
            <Link to="/ai-assistant" onClick={() => setMobileOpen(false)} className="py-2">AI Assistant</Link>
            <div className="border-t pt-2">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-sky-700">Hi, {user.name.split(' ')[0]}</span>
                  <button onClick={onLogout} className="px-3 py-1.5 rounded-md border border-sky-200 text-sky-700">Logout</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="py-2">Login</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)} className="py-2">Signup</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
