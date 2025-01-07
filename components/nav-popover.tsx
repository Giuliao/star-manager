"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverArrow,
} from "@/components/ui/popover";


interface Props extends React.HTMLAttributes<HTMLDivElement> {
  onAdd?: (name: string) => void;
  initValue?: string;
  isEdit?: boolean;
  alignOffest?: number
}

export function NavPopover({ children, onAdd, initValue, isEdit, alignOffest }: Props) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(initValue || "");

  const onAddClick = () => {
    setOpen(false);
    onAdd?.(name);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="start"
        alignOffset={alignOffest ?? -250}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{isEdit ? 'Edit Tag' : 'Add Tag'}</h4>
            <p className="text-sm text-muted-foreground">
              {isEdit ? 'modify a tag' : 'add a new tag'}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={initValue}
                placeholder="please input a tag name"
                className="col-span-2 h-8"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button onClick={onAddClick}>{isEdit ? 'Save' : 'Add'}</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
        <PopoverArrow className="fill-background z-10 relative" />
      </PopoverContent>
    </Popover>
  )
}
