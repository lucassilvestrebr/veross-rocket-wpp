// /api/outreach.js  (Vercel Serverless Function - Node.js)
export default async function handler(req, res) {
  // CORS básico (se quiser testar via devtools direto)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' });

  try {
    const body = req.body && typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');

    // URL de PRODUÇÃO do n8n (Webhook)
    const WEBHOOK_PROD = 'https://webhook.veross.com.br/webhook/rocketflow-outreach';

    const n8nRes = await fetch(WEBHOOK_PROD, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await n8nRes.text();

    // 🔙 Padroniza resposta em JSON
    return res.status(200).json({
      ok: n8nRes.ok,
      status: n8nRes.status,
      body: text,
    });
  } catch (e) {
    return res.status(500).json({ ok: false, status: 500, body: String(e?.message || e) });
  }
}
