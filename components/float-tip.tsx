"use client"
import { Skeleton } from '@/components/ui/skeleton';
import { queryOpenAI } from '@/lib/actions/ai';
import { queryChat } from '@/lib/query/chat';
import { cn, markdownToHtml, abortableStream, withAbort } from '@/lib/utils';
import { processDataStream } from 'ai';
import { Bot } from 'lucide-react';
import { useEffect, useState, useTransition } from 'react';

type Props = React.HTMLAttributes<HTMLDivElement> & {
  markdownStr: string;
};



export function FloatTip({ markdownStr, className }: Props) {

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    (async () => {
      try {
        const response = await queryChat([{
          role: "user",
          content: markdownStr
        }],
          controller.signal
        );

        await processDataStream({
          stream: response.body as ReadableStream<Uint8Array>,
          onTextPart(value) {
            setMessage(prev => `${prev}${value}`);
          },
          onDataPart(value) {
          },
          onErrorPart(value) {
            console.log(value);
          },
          onFinishMessagePart: () => {
            setLoading(false);
          }
        });
      } catch (e) {
        if ((e as any).name === 'AbortError') {
          console.log(e);
        } else {
          console.error(e)
        }
      }
    })();

    return () => {
      controller.abort();
    }
  }, [])

  return (
    <div className={cn("flex flex-col gap-2 group", className)}>
      <Bot className={cn("group-hover:bg-white rounded-lg w-8 h-8 text-primary absolute -top-4 -left-2", loading ? "animate-pulse" : "")} />
      <div className='flex-1 overflow-hidden group-hover:overflow-visible group-hover:overflow-y-auto'>
        <div
          className="inline-block p-4 rounded-lg text-black text-left"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(message) }}
        />
        {loading &&
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
