"use client";
import { useState, useEffect } from "react";
import { useStarCtx } from "@/lib/context/star";
import type { NavItem } from "@/components/nav-sidebar";
import type { FlatTagType } from "@/types/github";

export function parseNavItem(navitems: NavItem[], prefix: string = "") {
  const results: FlatTagType[] = [];
  for (let item of navitems) {
    const newPrefix = `${!prefix ? "" : `${prefix}/`}${item.title}`;
    results.push({
      name: newPrefix,
    });

    if (item.items) {
      results.push(...parseNavItem(item.items, newPrefix));
    }
  }
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
