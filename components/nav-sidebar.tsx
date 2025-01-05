"use client";
import {
  Plus,
  ChevronRight,
  Trash2,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavPopover } from "@/components/nav-popover";
import type { NavTagItem } from '@/types/tag';


interface Props {
  item: NavTagItem;
  indices: number[];
  onAddChange?: (changedItem: NavTagItem, newItem: NavTagItem, indices: number[]) => void;
  onDeleteChange?: (item: NavTagItem, indices: number[]) => void;
  onNavItemClick?: (item: NavTagItem, indices: number[]) => void;
}

export function NavSidebar({ item, onAddChange, indices, onDeleteChange, onNavItemClick }: Props) {
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

  const handleNavItemClick = (item: NavTagItem, indices: number[]) => {
    onNavItemClick?.(item, indices);
  }
  return (
    <SidebarMenu>
      <Collapsible
        key={item.id}
        asChild
        defaultOpen={item.isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title} className="group/button">
              <ChevronRight className="mr-2 transition-transform duration-200 group-data-[state=open]/button:rotate-90" />
              {item.icon && <item.icon />}
              <span className="cursor-pointer" onClick={() => handleNavItemClick(item, indices)}>{item.title}</span>
              <NavPopover onAdd={(name) => onAddClick(name, item, indices)}>
                <Plus
                  className="float-right invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
                  onClick={(evt) => { evt.stopPropagation(); }}
                />
              </NavPopover>
              <Trash2
                className="float-right invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
                onClick={(evt) => onDeleteClick(evt, item, indices)}
              />
              {item.content?.length ? <span className="float-right invisible group-hover/button:visible">{`${item.content.length}`}</span> : ''}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem, idx: number) => (
                subItem?.items?.length && subItem.items.length > 0
                  ? <NavSidebar
                    key={subItem.id}
                    item={subItem}
                    indices={[...indices, idx]}
                    onAddChange={onAddChange}
                    onDeleteChange={onDeleteChange}
                  />
                  : <SidebarMenuSubItem key={subItem.id} >
                    <SidebarMenuSubButton asChild>
                      <div className="group/button cursor-pointer">
                        <span className="cursor-pointer" onClick={() => handleNavItemClick(subItem, [...indices, idx])}>{subItem.title}</span>
                        <NavPopover onAdd={(name) => onAddClick(name, subItem, [...indices, idx])}>
                          <Plus
                            className="invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
                            onClick={(event) => { event.stopPropagation(); }}
                          />
                        </NavPopover>
                        <Trash2
                          className="float-right invisible group-hover/button:visible hover:cursor-pointer active:animate-ping"
                          onClick={(event) => onDeleteClick(event, subItem, [...indices, idx])}
                        />
                        {subItem.content?.length ? <span className="float-right invisible group-hover/button:visible ">{`${subItem.content.length}`}</span> : ''}
                      </div>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  )
}
