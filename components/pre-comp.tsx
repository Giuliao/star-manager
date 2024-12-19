"use client";
import { useState, useEffect } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';


const PreComp = (props: any) => {
  const [showCopied, setShowCopied] = useState(false);
  const [isSecureCtx, setIsSecureCtx] = useState(false);
  useEffect(() => {
    setIsSecureCtx(window.isSecureContext);
  }, []);
  return (
    <div className="relative group">
      <pre
        {...props}
        className={cn(
          "bg-[hsl(var(--sidebar-background))] rounded-lg block group is-pre shadow-md p-2 text-sm my-4",

          props.className
        )}
      ></pre>
      {isSecureCtx && (
        <div className="absolute right-10 w-6 h-6 p-1 shadow-sm top-1/3 cursor-pointer bg-white hidden group-hover:block active:animate-jump hover:shadow-md">
          {showCopied ? (
            <Check className="w-full h-full text-green-700" />
          ) : (
            <Copy
              className="w-full h-full"
              onClick={() => {
                navigator.clipboard.writeText(props?.children?.props?.children);
                setShowCopied(true);
                setTimeout(() => setShowCopied(false), 1000);
              }}
            ></Copy>
          )}
        </div>
      )}
    </div>
  );
};


export { PreComp };
