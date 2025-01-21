import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import {
  OPENAI_MODEL,
  OPENAI_API_KEY,
  OPENAI_BASE_URL
} from '@/lib/constants';
import { auth } from "@/auth"; // Referring to the auth.ts we just created




// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const openai = createOpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const sess = await auth() as any;

  if (!sess || !sess.user) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue("You need to be authenticated to use this feature");
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text-plain; charset=utf-8"
      }
    })
  }

  const { messages } = await req.json();
  const result = streamText({
    model: openai(OPENAI_MODEL),
    messages,
    tools: {
      weather: tool({
        description: 'Get the weather in a location (fahrenheit)',
        parameters: z.object({
          location: z.string().describe('The location to get the weather for'),
        }),
        execute: async ({ location }) => {
          const temperature = Math.round(Math.random() * (90 - 32) + 32);
          return {
            location,
            temperature,
          };
        },
      }),
      convertFahrenheitToCelsius: tool({
        description: 'Convert a temperature in fahrenheit to celsius',
        parameters: z.object({
          temperature: z
            .number()
            .describe('The temperature in fahrenheit to convert'),
        }),
        execute: async ({ temperature }) => {
          const celsius = Math.round((temperature - 32) * (5 / 9));
          return {
            celsius,
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
