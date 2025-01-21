"use client";
import { useRef } from "react";

export function useDebounce<F extends (...args: any[]) => void>(func: F, delay: number) {
  const ref = useRef<NodeJS.Timeout | undefined>(undefined);

  return function (...args: Parameters<F>) {
    clearTimeout(ref.current);
    ref.current = setTimeout(() => func(...args), delay);
  }
}
