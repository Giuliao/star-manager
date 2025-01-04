"use client";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";
import type { FlatTagType } from "@/types/tag";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onAdd?: (name: FlatTagType) => void;
  tagList: FlatTagType[];
}

export function TagPopover({ children, onAdd, tagList }: Props) {

  const [open, setOpen] = useState(false);

  const onAddClick = (item: FlatTagType) => {
    setOpen(false);
    onAdd?.(item);
  }


  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="max-w-40 max-h-[50vh] p-2 py-1"
        align="start"
        alignOffset={-20}
        onClick={(evt) => { evt.stopPropagation(); }}
      >
        <div className="w-full h-full flex flex-col items-start justify-start overflow-y-auto gap-1">
          {
            tagList?.map((tag, i) => (
              <span key={i} className="cursor-pointer hover:bg-accent w-full text-sm" onClick={() => onAddClick(tag)}>#{tag.name}</span>
            ))
          }
        </div>
        <PopoverArrow className="fill-background z-10 relative" />
      </PopoverContent>
    </Popover>
  )
}
