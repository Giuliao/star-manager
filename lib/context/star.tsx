"use client";
import { createContext, useState, useContext } from "react";
import type { NavTagItem, FlatTagType } from "@/types/tag";
import type { StarItem } from "@/types/github";

interface StarContextType {
  tagList: NavTagItem[];
  selectedStar?: StarItem;
  selectedTag?: FlatTagType;
  isDeleteTag?: boolean;
}


const StarContext = createContext<[StarContextType, React.Dispatch<React.SetStateAction<StarContextType>>]>([
  {
    tagList: [],
  } as StarContextType,
  () => { },
]);


function useStarCtx() {
  const ctx = useContext(StarContext);
  if (!ctx) {
    throw new Error("useStarCtx must be used within a StarProvider.");

  }
  return ctx;
}


const StarProvider = ({ children }: { children: React.ReactNode }) => {
  const [ctx, setCtx] = useState<StarContextType>({
    tagList: [],
  });
  return <StarContext.Provider value={[ctx, setCtx]}>{children}</StarContext.Provider>
};


export { StarContext, StarProvider, useStarCtx };
