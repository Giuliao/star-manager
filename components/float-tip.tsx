"use client"
import { markdownToHtml, cn } from '@/lib/utils';
import { queryOpenAI } from '@/lib/actions/ai';
import { processDataStream } from 'ai';
import { useEffect, useState, useTransition } from 'react';
import { Bot } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  markdownStr: string;
};

export function FloatTip({ markdownStr, className }: Props) {

  const [message, setMessage] = useState<string>("");
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    console.log("request openai====>");
    startTransition(async () => {
      const response = await queryOpenAI([{
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
          console.log(value);
        },
      });
    });

  }, [])

  return (
    <div className={cn("flex flex-col gap-2 group", className)}>
      <Bot className={cn("group-hover:bg-white rounded-lg w-8 h-8 text-primary absolute -top-4 -left-2", pending ? "animate-pulse" : "")} />
      <div className='flex-1 overflow-hidden group-hover:overflow-visible group-hover:overflow-y-auto'>
        <div
          className="inline-block p-4 rounded-lg text-black text-left"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(message) }}
        />
        {pending &&
          <div className="flex gap-4 flex-col px-4 justify-center items-start">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-[250px] rounded-lg" />
            <Skeleton className="h-4 w-[200px] rounded-lg" />
          </div>
        }

      </div>
    </div>
  )
}
