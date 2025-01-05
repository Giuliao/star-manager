"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { X } from "lucide-react"
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useStarCtx } from "@/lib/context/star";
import { parseNavItem } from "@/lib/hooks/use-taglist";
import { FlatTagType } from "@/types/tag";
import { Session } from "inspector";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  onInputChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onTagChange?: (tags: FlatTagType[]) => void;
}

export function SearchControl({ onInputChange, onTagChange }: Props) {

  const [starCtx, setStarCtx] = useStarCtx()
  const [tags, setTags] = useState<FlatTagType[]>([])

  useEffect(() => {
    if (starCtx.selectedSidebarTag) {
      const result = parseNavItem([starCtx.selectedSidebarTag]);
      setTags(result);
      onTagChange?.(result);
      setStarCtx(prev => ({ ...prev, selectedSidebarTag: undefined }));
    }
  }, [starCtx.selectedSidebarTag])

  const onRemoveSearchTag = (item: FlatTagType) => {
    setTags(prev => prev.filter(data => data.name !== item.name));
    onTagChange?.(tags.filter(data => data.name !== item.name));
  }

  return (
    <div className="w-full items-center sticky top-0 bg-white shadow-md p-2">
      <Input className="w-full" onChange={onInputChange} />
      <div className={cn("justify-start item-center flex-wrap gap-1 mt-2", tags.length > 0 ? 'flex' : 'hidden')}>
        {
          tags.map((tag: FlatTagType, i) => {
            return (
              <div className="cursor-text bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-lg max-w-80 group flex justify-start items-center" key={i}>
                {tag.name}
                <X
                  onClick={() => onRemoveSearchTag(tag)}
                  className="transition-[width] ease-in-out duration-300 w-0 h-3.5 group-hover:w-3.5 ml-1 cursor-pointer"
                />
              </div>

            )
          })
        }
      </div>
    </div>
  )
}
