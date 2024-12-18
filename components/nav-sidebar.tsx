"use client";
import { nanoid } from "nanoid";
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



export interface NavItem {
  id: string;
  title: string;
  url: string;
  icon?: React.ComponentType<any>;
  isActive?: boolean;
  items?: NavItem[];
}

interface Props {
  item: NavItem;
  indices: number[];
  onAddChange?: (item: NavItem, indices: number[]) => void;
  onDeleteChange?: (item: NavItem, indices: number[]) => void;
}

export function NavSidebar({ item, onAddChange, indices, onDeleteChange }: Props) {
  const onAddClick = (name: string, item: NavItem, indices: number[]) => {
    const newItem = {
      id: nanoid(10),
      title: name,
      url: "",
    };

    if (item.items) {
      item.items.push(newItem);
    } else {
      item.items = [newItem];
    }

    onAddChange?.(item, indices);
  }
  const onDeleteClick = (event: React.MouseEvent<SVGElement>, item: NavItem, indices: number[]) => {
    event.preventDefault();
    event.stopPropagation();

    onDeleteChange?.(item, indices);
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
              <ChevronRight className="mr-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              {item.icon && <item.icon />}
              <span>{item.title}</span>
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
                      <div className="group/button">
                        <span>{subItem.title}</span>
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
