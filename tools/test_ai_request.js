(async () => {
    try {
        const base = 'http://localhost:5000'
        const rnd = Date.now() % 100000
        const email = `testuser+${rnd}@example.com`
        const password = 'TestPass123!'
        const name = 'Test User'
        const headers = { 'Content-Type': 'application/json' }

        console.log('Attempting signup...')
        let r = await fetch(base + '/api/auth/signup', { method: 'POST', headers, body: JSON.stringify({ name, email, password }) })
        if (r.status === 409) {
            console.log('User already exists, trying login')
            r = await fetch(base + '/api/auth/login', { method: 'POST', headers, body: JSON.stringify({ email, password }) })
        }
        const js = await r.text()
        let parsed
        try { parsed = JSON.parse(js) } catch (e) { console.error('Non-JSON response for auth:', r.status, js); process.exit(1) }
        if (!parsed.token) { console.error('No token returned from auth:', parsed); process.exit(1) }
        console.log('Got token. Now calling /api/ask-ai')
        const token = parsed.token
        const qres = await fetch(base + '/api/ask-ai', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, body: JSON.stringify({ question: 'Say hello and identify if OpenAI key is set on server.' }) })
        const text = await qres.text()
        console.log('ask-ai status:', qres.status)
        console.log('ask-ai response:', text)
    } catch (e) { console.error('Script error', e) }
})()
