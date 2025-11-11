
import React, { useState } from 'react'
import { login as apiLogin } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLocation, useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate(); const loc = useLocation()

  async function submit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const { data } = await apiLogin({ email, password })
      login(data.user, data.token)
      nav(loc.state?.from || '/')
    } catch (e) {
      setError(e?.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const bgUrl = "https://img.freepik.com/free-vector/e-learning-education-template-vector-technology-ad-banner_53876-125996.jpg?semt=ais_hybrid&w=740&q=80"
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${bgUrl})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10" />
      {/* gradient that fades the background into the footer color (white) */}
      <div className="absolute inset-x-0 bottom-0 h-48 z-20" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.98) 100%)' }} />
      <div className="relative z-30 w-full max-w-md mx-auto p-6">
        <div className="bg-white/95 rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6">Login</h1>
          <form onSubmit={submit} className="space-y-4">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-3 py-2" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-3 py-2" required />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button disabled={loading} className="w-full px-4 py-2 rounded-xl bg-black text-white">{loading ? 'Logging in…' : 'Login'}</button>
          </form>
          <p className="text-sm text-gray-600 mt-3">No account? <Link to="/signup" className="underline">Sign up</Link></p>
        </div>
      </div>
    </div>
  )
}
