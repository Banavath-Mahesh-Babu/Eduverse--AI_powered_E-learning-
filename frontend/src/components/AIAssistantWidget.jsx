import React, { useState } from 'react'
import { askAI } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AIAssistantWidget() {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [q, setQ] = useState('')
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(false)

    const send = async (preset) => {
        const question = preset ?? q.trim()
        if (!question) return
        const selection = window.getSelection ? window.getSelection().toString() : ''
        const context = { url: window.location.href, selection }
        setHistory(h => [...h, { role: 'user', text: question }])
        setQ('')
        setLoading(true)
        try {
            const { data } = await askAI({ question, context })
            const answer = data?.answer || data?.text || JSON.stringify(data)
            setHistory(h => [...h, { role: 'ai', text: answer }])
        } catch (err) {
            // Try to show a helpful error from the server (e.g. invalid API key)
            let msg = '⚠️ Error contacting AI'
            try {
                if (err?.response?.data) {
                    const d = err.response.data
                    if (d.error) msg = d.error + (d.details ? ': ' + (typeof d.details === 'string' ? d.details : JSON.stringify(d.details)) : '')
                    else msg = JSON.stringify(d)
                } else if (err?.message) {
                    msg = err.message
                }
            } catch (e) { /* swallow */ }
            setHistory(h => [...h, { role: 'ai', text: msg }])
        } finally { setLoading(false) }
    }

    return (
        <>
            <button onClick={() => setOpen(true)} title="Open AI assistant" className="fixed right-4 bottom-4 z-[9999] bg-transparent hover:opacity-90 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg">
                {/* Inline SVG bot image (purple circle with "AI" text) to avoid external assets */}
                <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="AI assistant">
                    <circle cx="28" cy="28" r="28" fill="#5B21B6" />
                    {/* Simple robot icon (head + eyes + mouth) instead of text */}
                    <g transform="translate(8,8) scale(0.8)">
                        <rect x="12" y="10" width="32" height="28" rx="6" fill="#FFFFFF" opacity="0.06" />
                        <rect x="20" y="20" width="6" height="6" rx="1" fill="#FFFFFF" />
                        <rect x="34" y="20" width="6" height="6" rx="1" fill="#FFFFFF" />
                        <rect x="26" y="28" width="8" height="4" rx="1" fill="#FFFFFF" />
                        <rect x="24" y="6" width="12" height="4" rx="2" fill="#FFFFFF" />
                        <circle cx="28" cy="10" r="2" fill="#FFFFFF" />
                    </g>
                </svg>
            </button>
            {open && (
                <div className="fixed right-4 bottom-16 sm:right-6 sm:bottom-20 z-[10000] w-[92%] sm:w-96 bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col" style={{ maxHeight: '70vh' }}>
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                        <div className="font-semibold">Eduverse Assistant</div>
                        <div className="flex items-center gap-2">
                            {!user && <a href="/login" className="text-sm text-indigo-600">Sign in</a>}
                            <button onClick={() => setOpen(false)} className="text-gray-600">✕</button>
                        </div>
                    </div>
                    <div className="p-3 flex-1 overflow-auto space-y-3">
                        {history.length === 0 && <div className="text-sm text-gray-500">Ask about the current page or selected text. Select text on the page then click "Ask selection".</div>}
                        {history.map((m, idx) => (
                            <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                                <div className={m.role === 'user' ? 'inline-block bg-gray-100 text-gray-900 px-3 py-2 rounded-lg' : 'inline-block bg-indigo-50 text-gray-900 px-3 py-2 rounded-lg'}>{m.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t">
                        <div className="flex flex-col sm:flex-row gap-2 mb-2">
                            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Type your question..." className="flex-1 border rounded-xl px-3 py-2" onKeyDown={e => e.key === 'Enter' && send()} />
                            <button onClick={() => send()} disabled={loading} className="px-3 py-2 rounded-xl bg-brand text-white w-full sm:w-auto">{loading ? '…' : 'Ask'}</button>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={() => { const s = window.getSelection ? window.getSelection().toString() : ''; if (s) send(s) }} className="text-sm px-3 py-1 border rounded-lg w-full sm:w-auto">Ask selection</button>
                            <button onClick={() => send(`Summarize this page: ${document.title} (${window.location.href})`)} className="text-sm px-3 py-1 border rounded-lg w-full sm:w-auto">Summarize page</button>
                            <button onClick={() => send('Generate 5 practice questions for this course based on the current page content')} className="text-sm px-3 py-1 border rounded-lg w-full sm:w-auto">Generate quiz</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
