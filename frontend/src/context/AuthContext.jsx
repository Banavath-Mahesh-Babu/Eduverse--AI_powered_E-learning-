
import React, { createContext, useContext, useEffect, useState } from 'react'
const AuthCtx = createContext(null)
export function AuthProvider({ children }) {
  // In development we prefer starting signed-out to avoid stale tokens auto-signing-in
  // Use Vite's import.meta.env.DEV to detect dev mode. In production we restore from localStorage.
  const initialUser = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV)
    ? null
    : (() => { try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null } })()
  const initialToken = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV)
    ? ''
    : (localStorage.getItem('token') || '')

  const [user, setUser] = useState(initialUser)
  const [token, setToken] = useState(initialToken)
  function login(u, t) { setUser(u); setToken(t); localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('token', t) }
  function logout() { setUser(null); setToken(''); localStorage.removeItem('user'); localStorage.removeItem('token') }
  useEffect(() => { }, [user, token])
  return <AuthCtx.Provider value={{ user, token, login, logout }}>{children}</AuthCtx.Provider>
}
export function useAuth() { return useContext(AuthCtx) }
