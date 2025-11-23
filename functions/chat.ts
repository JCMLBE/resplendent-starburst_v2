import { GoogleGenAI } from "@google/genai";
import { getStore } from '@netlify/blobs';
import { knowledgeBaseContent } from '../knowledge_base_content';
import { systemInstructions } from '../system_instructions';

// Interface for the incoming request body
interface RequestBody {
  history: { role: 'user' | 'model'; content: string }[];
}

// The system prompt, now on the server and using the imported knowledge base
const getSystemInstruction = (kb: string, instructions: string) => {
  return `${instructions}

Hier is de kennisbank waar je je antwoorden op moet baseren:
---
${kb}
---
`;
};

// This is the handler for the serverless function.
// It uses the standard Request and Response objects for maximum compatibility.
export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { history } = await req.json() as RequestBody;

    if (!history || history.length === 0) {
      return new Response(JSON.stringify({ error: 'Chat history is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    // The API key is safely retrieved from server environment variables
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API_KEY is not set in environment variables.");
    }

    // Get updated content from Blobs if available, otherwise use defaults
    const store = getStore('admin-config');
    const updatedKnowledgeBase = await store.get('knowledge_base');
    const updatedInstructions = await store.get('system_instructions');

    const kb = updatedKnowledgeBase || knowledgeBaseContent;
    const instructions = updatedInstructions || systemInstructions;

    const systemInstruction = getSystemInstruction(kb, instructions);
    
    const ai = new GoogleGenAI({ apiKey });

    // Reconstitute the chat on the server
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
        // Convert our history format to the GenAI library's format
        history: history.slice(0, -1).map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
        }))
    });

    const lastMessage = history[history.length - 1];
    
    const result = await chat.sendMessage({ message: lastMessage.content });

    return new Response(JSON.stringify({ text: result.text }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: error.message || 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
