// api/outreach.js  (Serverless Function na Vercel)
export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).send('Method Not Allowed');
  }

  // 1) Body do front (Next Pages já parseia JSON)
  const payload = request.body ?? {};

  // 2) URL *de produção* do seu Webhook do n8n
  const n8nUrl = 'https://webhook.veross.com.br/webhook/rocketflow-outreach';

  // 3) Repasse para o n8n
  const r = await fetch(n8nUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const text = await r.text();

  // 4) Devolva a resposta para o front (útil para debug)
  response
    .status(r.status)
    .setHeader('content-type', r.headers.get('content-type') ?? 'text/plain')
    .send(text);
}
