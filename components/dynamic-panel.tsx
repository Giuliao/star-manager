"use client";
import { useEffect, useState } from "react";
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
    <>
      {
        showPanel && <Card className="w-[90%] bg-white mx-10 h-80 absolute bottom-8 z-10 p-4 animate-in fade-in duration-500" >
          which key
        </Card>

      }
    </>
  );
}
