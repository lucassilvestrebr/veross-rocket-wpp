// api/outreach.js  — Vercel Edge Function (lê JSON certo)
export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' }
    });
  }

  // 1) Lê o corpo enviado pelo browser
  const payload = await request.json().catch(() => ({}));

  // 2) Escolhe Test ou Production do n8n
  const useTest = new URL(request.url).searchParams.get('test') === '1';
  const N8N_PROD_URL = 'https://webhook.veross.com.br/webhook/rocketflow-outreach';
  const N8N_TEST_URL = 'https://n8n.veross.com.br/webhook-test/rocketflow-outreach';
  const url = useTest ? N8N_TEST_URL : N8N_PROD_URL;

  // 3) Repassa o JSON para o n8n
  const upstream = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const text = await upstream.text();

  // 4) Devolve status/ok para o front (em JSON)
  return new Response(JSON.stringify({ ok: upstream.ok, status: upstream.status, body: text }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
