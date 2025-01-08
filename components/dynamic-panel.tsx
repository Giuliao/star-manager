"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Card } from '@/components/ui/card';
import { useChat } from 'ai/react';

export function DynamicPanel() {
  const [showPanel, setShowPanel] = useState(false);
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === ' ' && !showPanel) {
        event?.preventDefault();
        event?.stopPropagation();
        setShowPanel(true);
      }

      if (event.key === 'Escape') {
        event?.preventDefault();
        event?.stopPropagation();
        setShowPanel(false);
      }

    }

    document.addEventListener("keydown", keydownHandler);
    return () => {
      document.removeEventListener("keydown", keydownHandler);
    }

  }, []);

  return (
    <Card className={cn(
      "max-w-[1200px] w-full bg-gray-200/30 backdrop-blur-md mx-10 h-[95vh]",
      "absolute bottom-4 z-[500] py-4 animate-in fade-in duration-500",
      "flex flex-col items-center",
      showPanel ? "visible" : "hidden"
    )}>

      <div className="flex flex-col w-full stretch h-full pb-12 px-4 overflow-y-auto gap-2">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === 'user' ? 'User: ' : 'AI: '}
            {m.toolInvocations
              ? (<pre>{JSON.stringify(m.toolInvocations, null, 2)}</pre>)
              : (
                <p>{m.content}</p>
              )
            }
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="fixed bottom-4 px-4 w-full">
        <input
          className="w-full p-2 border border-gray-300 rounded"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>

    </Card>
  );
}
