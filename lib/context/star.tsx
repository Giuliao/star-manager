"use client";
import { createContext, useState, useContext } from "react";


interface StarContextType {
  tagList: string[];
  selectedStar: any;
}


const StarContext = createContext<[StarContextType, React.Dispatch<React.SetStateAction<StarContextType>>]>([
  {
    tagList: [],
    selectedStar: null
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
    selectedStar: null
  });
  return <StarContext.Provider value={[ctx, setCtx]}>{children}</StarContext.Provider>
};


export { StarContext, StarProvider, useStarCtx };
