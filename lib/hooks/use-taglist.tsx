"use client";
import { useState, useEffect } from "react";
import type { NavTagItem, FlatTagType } from "@/types/tag";

import { useAppSelector } from "@/lib/hooks/use-store";
import { selectedTagList } from "@/lib/store/star-slice";

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
  const [flatTag, setFlatTag] = useState<FlatTagType[]>([]);
  const tagList = useAppSelector(selectedTagList);

  useEffect(() => {
    setFlatTag(parseNavItem(tagList));
  }, [tagList])


  return [flatTag, setFlatTag];
}
