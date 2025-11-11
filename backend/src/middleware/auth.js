import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
    try {
        const h = req.headers.authorization || ''
        const t = h.startsWith('Bearer ') ? h.slice(7) : null
        if (!t) {
            console.debug('[auth] Authorization header missing')
            return res.status(401).json({ error: 'Auth token missing' })
        }
        // show a masked preview for debugging (do not log full token)
        try {
            const preview = t.slice(0, 8) + '...' + t.slice(-4)
            console.debug('[auth] token preview', preview)
        } catch (e) { /* ignore */ }
        const p = jwt.verify(t, process.env.JWT_SECRET || 'devsecret')
        req.user = p
        next()
    } catch (e) {
        console.debug('[auth] token verify failed:', e && e.message)
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}