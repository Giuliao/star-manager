"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"
import { Card } from '@/components/ui/card';

export function DynamicPanel() {
  const [showPanel, setShowPanel] = useState(false);
  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === ' ') {
        setShowPanel((prev) => !prev);
      }

      if (event.key === 'Escape') {
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
      "w-[calc(100%-2rem)] bg-gray-200/30 backdrop-blur-sm mx-10 h-80 absolute bottom-4 z-10 p-4 animate-in fade-in duration-500",
      showPanel ? "visible" : "hidden"
    )}>
      which key
      <ul className="list-disc">
        <li>

          show login
        </li>
      </ul>
    </Card>
  );
}
