"use client";
import {
  Plus,
  Trash2,
  PencilLine,
} from "lucide-react"
import { NavPopover } from "@/components/nav-popover";
import type { NavTagItem } from '@/types/tag';


interface Props {
  item: NavTagItem;
  indices: number[];
  onAddChange?: (changedItem: NavTagItem, newItem: NavTagItem, indices: number[]) => void;
  onDeleteChange?: (item: NavTagItem, indices: number[]) => void;
  onNavItemClick?: (item: NavTagItem, indices: number[]) => void;
  onEditChange?: (changeItem: NavTagItem, indices: number[]) => void;
}

export function NavSidebarOperaions({
  item,
  onAddChange,
  indices,
  onDeleteChange,
  onNavItemClick,
  onEditChange
}: Props) {
  const onAddClick = (name: string, item: NavTagItem, indices: number[]) => {
    const newItem = {
      title: name,
      parentId: item.id as string
    };

    if (item.items) {
      item.items.push(newItem);
    } else {
      item.items = [newItem];
    }

    onAddChange?.(item, newItem, indices);
  }
  const onDeleteClick = (event: React.MouseEvent<SVGElement>, item: NavTagItem, indices: number[]) => {
    event.preventDefault();
    event.stopPropagation();

    onDeleteChange?.(item, indices);
  }


  const handleEditTitle = (name: string, item: NavTagItem, indices: number[]) => {
    onEditChange?.({
      ...item,
      title: name
    }, indices);
  }
  return (
    <div className="flex justify-end items-center [&>svg]:size-4 [&>svg]:shrink-0 gap-1">
      <NavPopover onAdd={(name) => onAddClick(name, item, indices)}>
        <Plus
          className="float-right invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
          onClick={(evt) => { evt.stopPropagation(); }}
        />
      </NavPopover>
      <NavPopover isEdit initValue={item.title} onAdd={(name) => handleEditTitle(name, item, indices)}>
        <PencilLine
          className="float-right invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
          onClick={(evt) => { evt.stopPropagation(); }}
        />
      </NavPopover>
      <Trash2
        className="float-right invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
        onClick={(evt) => onDeleteClick(evt, item, indices)}
      />
      <span className="invisible group-hover/root-container:visible">{`${item.content?.length || 0}`}</span>
    </div>
  )
}
