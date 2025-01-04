"use client";
import { useState, useEffect } from "react";
import { useStarCtx } from "@/lib/context/star";
import type { NavTagItem, FlatTagType } from "@/types/tag";

export function parseNavItem(navitems: NavTagItem[], prefix: string = "", indices: number[] = []) {
  const results: FlatTagType[] = [];
  navitems.forEach((item, idx) => {
    const newPrefix = `${!prefix ? "" : `${prefix}/`}${item.title}`;
    results.push({
      name: newPrefix,
      item: item,
      indices: [...indices, idx]
    });

    if (item.items) {
      results.push(...parseNavItem(item.items, newPrefix, [...indices, idx]));
    }
  })
  return results;
}


export function useTagList() {
  const [starCtx] = useStarCtx();
  const [flatTag, setFlatTag] = useState<FlatTagType[]>([]);

  useEffect(() => {
    setFlatTag(parseNavItem(starCtx.tagList));
  }, [starCtx.tagList])


  return [flatTag, setFlatTag];
}
