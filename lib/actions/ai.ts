"use server";
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';


const openai = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

export async function queryOpenAI(messages: CoreMessage[]) {
  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStream();
}
