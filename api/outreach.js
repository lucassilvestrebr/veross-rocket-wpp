// api/outreach.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    // ⬇️ Cole AQUI a Production URL do nó Webhook (copie do n8n)
    const N8N_URL = 'https://webhook.veross.com.br/webhook/rocketflow-outreach';

    const upstream = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    const text = await upstream.text();
    res.status(upstream.status).json({ ok: upstream.ok, status: upstream.status, body: text });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
