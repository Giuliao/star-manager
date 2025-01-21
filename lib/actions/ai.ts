"use server";
import { createOpenAI } from '@ai-sdk/openai';
import { CoreMessage, streamText } from 'ai';
import {
  OPENAI_MODEL,
  OPENAI_API_KEY,
  OPENAI_BASE_URL
} from '@/lib/constants';


const openai = createOpenAI({
  baseURL: OPENAI_BASE_URL,
  apiKey: OPENAI_API_KEY,
});


// TODO: how to stop a server action
export async function queryOpenAI(messages: CoreMessage[], signal?: AbortSignal) {
  messages.unshift(
    {
      role: "user",
      content: "你是一个专业的信息总结师，请你用准确专业的言语概括内容。用户将发送readme源文件内容给你，请配合输出对应的中文总结概括"
    } as CoreMessage,
  );

  const result = streamText({
    model: openai(OPENAI_MODEL),
    messages,
    abortSignal: signal
  });

  return result.toDataStream();
}
