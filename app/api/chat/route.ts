import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import {
  OPENAI_MODEL,
  OPENAI_API_KEY,
  OPENAI_BASE_URL
} from '@/lib/constants';
import { auth } from "@/auth"; // Referring to the auth.ts we just created
import { NextResponse } from 'next/server';
import { captureServerEvent } from "@/lib/analytics/server";
import {
  AnalyticsEvents,
  getAnalyticsDistinctId
} from "@/lib/analytics/events";
import type { SessionUser } from "@/types/user";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
const openai = createOpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const sess = await auth() as any;
  const distinctId = getAnalyticsDistinctId(
    (sess?.user as SessionUser | undefined)?.dbId
  );

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

  if (process.env.E2E_TEST === "1") {
    const encoder = new TextEncoder();

    return new Response(new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode("E2E summary stream\n"));
        controller.close();
      }
    }), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  try {
    const { messages } = await req.json();
    void captureServerEvent(AnalyticsEvents.AiSummaryStreamStarted, distinctId, {
      message_count: Array.isArray(messages) ? messages.length : 0
    });
    const result = streamText({
      model: openai(OPENAI_MODEL),
      messages,
      abortSignal: req.signal
    });

    return result.toDataStreamResponse();

  } catch (err) {
    void captureServerEvent(AnalyticsEvents.AiSummaryFailed, distinctId, {
      reason: "route-error"
    });
    return NextResponse.json({ error: err });
  }
}
