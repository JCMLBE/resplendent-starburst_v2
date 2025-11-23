import { getStore } from '@netlify/blobs';
import { knowledgeBaseContent } from '../../knowledge_base_content';

export default async (req: Request) => {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const store = getStore('admin-config');
    const updatedContent = await store.get('knowledge_base');

    // Return updated content from blob if exists, otherwise return default
    const content = updatedContent || knowledgeBaseContent;

    return new Response(JSON.stringify({ content }), {
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
