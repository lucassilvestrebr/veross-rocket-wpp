// api/outreach.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const N8N_URL = 'https://webhook.veross.com.br/webhook/rocketflow-outreach';

    // repassa o JSON (corpo do front) para o n8n
    const upstream = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });

    const text = await upstream.text();

    // devolve o status REAL do n8n para o browser
    res.status(upstream.status).json({
      ok: upstream.ok,
      status: upstream.status,
      body: text
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
