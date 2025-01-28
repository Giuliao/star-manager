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
    abortSignal: req.signal
  });

  return result.toDataStreamResponse();
}
