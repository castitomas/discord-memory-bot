import Groq from 'groq-sdk';
import type { ChatMessage, GenerateReplyParams } from './types.js';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY as string });

export async function generateReply({ username, facts, history, userMessage }: GenerateReplyParams): Promise<string> {
  const systemPrompt = `Sos un asistente amigable dentro de un servidor de Discord.
Hablás en español rioplatense, tono cercano y directo.
Datos que sabés del usuario (${username}): ${facts.length ? facts.join(', ') : 'todavía no sabés nada de él/ella'}.
Si el usuario menciona algo personal durable (gustos, trabajo, proyectos), no hace falta que lo repitas, ya se guarda aparte.`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: userMessage },
  ];

  const completion = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant', // modelo gratuito y rápido en Groq
    messages,
    temperature: 0.7,
    max_tokens: 400,
  });

  return completion.choices[0].message.content ?? '';
}