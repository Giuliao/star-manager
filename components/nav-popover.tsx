"use client";
import { useState } from "react";
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
}

export function NavPopover({ children, onAdd }: Props) {

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const onAddClick = () => {
    setOpen(false);
    onAdd?.(name);
  }

  return (
    <Popover open={open} onOpenChange={setOpen} >
      <PopoverTrigger asChild >
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="w-80"
        align="start"
        alignOffset={-20}
        onClick={(evt) => { evt.stopPropagation(); }}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">New Tag</h4>
            <p className="text-sm text-muted-foreground">
              add a new tag
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="please input a tag name"
                className="col-span-2 h-8"
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <Button onClick={onAddClick}>Add</Button>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
        <PopoverArrow className="fill-background z-10 relative" />
      </PopoverContent>
    </Popover>
  )
}
