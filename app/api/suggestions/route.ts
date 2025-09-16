import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';

export const suggestionsSchema = z.object({
    suggestions: z.array(z.string()).length(3),
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { prompt } = await req.json();

const result = streamObject({
  model: google('gemini-2.5-flash-lite'),
  schema: suggestionsSchema,
  prompt: `
  
  You are an AI assistant that generates questions. With the following input: "${prompt}", generate three concise and relevant questions about this topic.

  - The question must be posed to an AI assistant.
  - Do not ask questions directed at the user.
  
  `,
});

  return result.toTextStreamResponse();
}