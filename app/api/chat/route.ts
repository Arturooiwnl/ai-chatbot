import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';

// en:Allow streaming responses up to 30 seconds
// es:Permitir respuestas en streaming de hasta 30 segundos
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { model: string; messages: UIMessage[] } = await req.json();

  const result = streamText({
    system: 'You are a helpful assistant.',
    model: google('gemini-2.5-flash-lite'),
    messages: convertToModelMessages(messages),
    tools:{
      url_context: google.tools.urlContext({}),
      google_search: google.tools.googleSearch({})
    },
    providerOptions: {
      google: {
      thinkingConfig: {
        thinkingBudget: 8192,
        includeThoughts: true,
      },
      }
    }
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
    sendSources: true,
    onError: (error) => {
      if (error instanceof Error) {
        if (error.message.includes("Rate limit")) {
          return "Rate limit exceeded. Please try again later.";
        }
      }
      console.error(error);
      return "An error occurred.";
    },
  });
}