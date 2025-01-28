import { CoreMessage } from "ai";

export async function queryChat(messages: CoreMessage[], abortSignal?: AbortSignal) {
  return await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          role: "user",
          content: "你是一个专业的信息总结师，请你用准确专业的言语概括内容。用户将发送readme源文件内容给你，请配合输出对应的中文总结概括"
        },
        ...messages
      ]
    }),
    signal: abortSignal
  });
}
