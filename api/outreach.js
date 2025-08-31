// /api/outreach.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  // URLs do seu n8n (pode deixar hardcoded ou via env)
  const N8N_PROD_URL =
    process.env.N8N_PROD_URL ||
    'https://webhook.veross.com.br/webhook/rocketflow-outreach';

  const N8N_TEST_URL =
    process.env.N8N_TEST_URL ||
    'https://n8n.veross.com.br/webhook-test/rocketflow-outreach';

  // Se chamar /api/outreach?test=1 vai usar a Test URL (Listen for test event)
  const useTest = req.query?.test === '1' || req.headers['x-n8n-env'] === 'test';
  const url = useTest ? N8N_TEST_URL : N8N_PROD_URL;

  try {
    // repassa o corpo como veio do front (nome, objetivo, message_template, token, etc.)
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    // n8n pode responder texto puro
    const text = await r.text();

    return res.status(200).json({ ok: r.ok, status: r.status, body: text });
  } catch (err) {
    return res.status(500).json({ ok: false, message: String(err) });
  }
}
