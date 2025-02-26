"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { X, Menu } from "lucide-react"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseNavItem } from "@/lib/hooks/use-taglist";
import type { FlatTagType } from "@/types/tag";
import { useSidebar } from "@/components/ui/sidebar";
import { useAppSelector, useAppDispatch } from "@/lib/hooks/use-store";
import {
  selectedSidebarTag as _ctxSelectedSidebarTag,
  setSelectedSidebarTag
} from "@/lib/store/star-slice";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  onInputChange?: (evt: ChangeEvent<HTMLInputElement>) => void;
  onTagChange?: (tags: FlatTagType[]) => void;
}

export function SearchControl({ onInputChange, onTagChange, className }: Props) {

  const [tags, setTags] = useState<FlatTagType[]>([])
  const { setOpenMobile } = useSidebar()
  const ctxSelectedSidebarTag = useAppSelector(_ctxSelectedSidebarTag);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ctxSelectedSidebarTag) {
      const result = parseNavItem([ctxSelectedSidebarTag]);
      setTags(result);
      onTagChange?.(result);
      dispatch(setSelectedSidebarTag(undefined));
    }
  }, [ctxSelectedSidebarTag])

  const onRemoveSearchTag = (item: FlatTagType) => {
    setTags(prev => prev.filter(data => data.name !== item.name));
    onTagChange?.(tags.filter(data => data.name !== item.name));
  }

  return (
    <div className={cn("w-full items-center sticky top-0 bg-white shadow-md p-2", className)} onClick={(e) => e.stopPropagation()}>
      <div className="w-full flex justify-start gap-1">
        <Button variant="outline" size="icon" className="inline-flex sm:hidden" onClick={() => setOpenMobile(true)}>
          <Menu className="text-primary" />
        </Button>
        <Input placeholder="Please input repo name or description" className="w-full" onChange={onInputChange} />
      </div>
      <div className={cn("justify-start item-center flex-wrap gap-1 mt-2", tags.length > 0 ? 'flex' : 'hidden')}>
        {
          tags.map((tag: FlatTagType, i) => {
            return (
              <div className="animate-in fade-in slide-in-from-left-5 duration-300 \
                cursor-text bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-lg max-w-80 group flex justify-start items-center" key={i}>
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
