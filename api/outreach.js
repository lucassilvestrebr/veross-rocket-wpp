// api/outreach.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    const N8N_URL = 'https://webhook.veross.com.br/webhook/rocketflow-outreach';

    const upstream = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' }, // evita preflight no n8n
      body: JSON.stringify(req.body || {})
    });

    const text = await upstream.text();
    return res.status(200).json({ ok: upstream.ok, status: upstream.status, body: text });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
