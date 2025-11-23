import { getStore } from '@netlify/blobs';

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { instructions } = await req.json();

    if (!instructions) {
      return new Response(JSON.stringify({ error: 'Instructions are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const store = getStore('admin-config');
    await store.set('system_instructions', instructions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
