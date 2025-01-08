"use client"
import { markdownToHtml, cn } from '@/lib/utils';
import { queryOpenAI } from '@/lib/actions/ai';
import { processDataStream } from 'ai';
import { useEffect, useState, useTransition } from 'react';
import { Bot, LoaderCircle } from 'lucide-react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  markdownStr: string;
};

export function FloatTip({ markdownStr, className }: Props) {

  const [message, setMessage] = useState<string>("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const response = await queryOpenAI([
        {
          role: "user",
          content: "你是一个专业的信息总结师，请你用准确专业的言语概括内容。用户将发送readme源文件内容给你，请配合输出对应的中文总结概括"
        },
        {
          role: "user",
          content: markdownStr
        }]
      );

      await processDataStream({
        stream: response,
        onTextPart(value) {
          setMessage(prev => `${prev}${value}`);
        },
        onDataPart(value) {
        },
        onErrorPart(value) {
          throw new Error(value);
        },
      });
    });

  }, [])

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Bot className={cn("w-8 h-8 text-primary absolute -top-4 -left-2", pending ? "animate-pulse" : "")} />
      <div className='flex-1 overflow-hidden hover:overflow-visible'>
        <div
          className="inline-block p-4 rounded-lg text-black text-left"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(message) }}
        />
      </div>
    </div>
  )
}
