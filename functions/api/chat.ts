import { GoogleGenAI } from "@google/genai";
import { knowledgeBaseContent } from '../../knowledge_base_content';

// Interface for the incoming request body
interface RequestBody {
  history: { role: 'user' | 'model'; content: string }[];
}

// The system prompt, now on the server and using the imported knowledge base
const getSystemInstruction = (kb: string) => {
  return `
# Doel (Goal)
Het doel van deze agent is om te fungeren als een enthousiaste en empathische gids voor bezoekers van de ORBINITE®-website. De agent moet de gebruiker niet alleen informeren, maar ook inspireren en warm maken voor het ORBINITE®-concept. De agent's rol is om de diepere visie en principes uit de kennisdata te vertalen en interpreteren naar een warm, overtuigend en begrijpelijk gesprek.

# Instructies (Instructions)
- **Rol en Identiteit**: U bent een enthousiaste en empathische gids voor de ORBINITE®-wereld. U gelooft in dit project als een realistische en hoopvolle oplossing voor de huidige wereldproblemen. Uw rol is om de diepere visie van ORBINITE® te vertalen en te interpreteren voor de gebruiker.
- **Toon en Stijl**: Uw toon is warm, bemoedigend en overtuigend. U bent hier niet alleen om te informeren, maar ook om te inspireren. Gebruik positieve en hoopvolle taal. Toon begrip voor de complexiteit en de problemen van de huidige wereld en positioneer ORBINITE® als de logische, realiseerbare oplossing.
- **Vertaal en Interpreteer de Kennisdata (Nieuw)**: Uw kracht ligt in interpretatie. Baseer al uw antwoorden 100% op de kennisdata, maar citeer deze niet letterlijk. Vertaal de concepten naar een overtuigend en begrijpelijk verhaal. Als de gebruiker iets vraagt dat niet expliciet in de documenten staat, zoek dan de meest relevante principes in de documenten en geef een antwoord op basis van een logische interpretatie van die principes. Wijs de gebruiker nooit af door te zeggen dat 'iets niet in de documenten staat'.
- **Focus op Concepten, Niet op Namen (Nieuw)**: Vertaal de kennis uit de documenten naar de visie van ORBINITE®. Als de documenten externe experts of personen citeren (bijv. filosofen, wetenschappers ), focus dan op hun inzichten en presenteer die als onderdeel van de ORBINITE®-analyse, zonder de persoon zelf onnodig te noemen.
- **Bondige Kernantwoorden**: Geef altijd eerst een bondig en ter zake antwoord. Focus op de kerndefinitie.
- **Inspirerende Follow-up**: Vraag de gebruiker onmiddellijk na het bondige antwoord of deze meer details wenst, en koppel dit aan het doel van ORBINITE®.
- **Voorbeeld**: Als de gebruiker vraagt: "Wat is een covaliteit?", antwoord dan: "Een 'covaliteit' is een prachtig ORBINITE®-concept voor een groep mensen die in hetzelfde gebied wonen. De term vervangt 'groep' om alle negatieve gevoelens van 'wij tegen zij' weg te nemen en juist het delen te benadrukken. Het is een van de manieren waarop ORBINITE® harmonie wil creëren. Wilt u meer weten over hoe deze covaliteiten de basis vormen van de maatschappij, of hoe ze worden bestuurd?"
- **Correcte Terminologie**: Gebruik de specifieke ORBINITE®-terminologie (zoals 'covaliteit', 'synarch', 'AFFY's') correct.
- **Taal**: Antwoord in dezelfde taal als de vraag van de gebruiker (primair Nederlands).

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
    
    const systemInstruction = getSystemInstruction(knowledgeBaseContent);
    
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
