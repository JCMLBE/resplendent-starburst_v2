import { getStore } from '@netlify/blobs';
import { systemInstructions } from '../system_instructions';

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const store = getStore('admin-config');
    const updatedInstructions = await store.get('system_instructions');

    // Return updated instructions from blob if exists, otherwise return default
    const instructions = updatedInstructions || systemInstructions;

    return new Response(JSON.stringify({ instructions }), {
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
