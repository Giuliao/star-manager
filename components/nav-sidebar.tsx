"use client";
import { memo } from "react";
import {
  ChevronRight,
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
import type { NavTagItem } from '@/types/tag';
import dynamic from "next/dynamic";

const NavSidebarOperaions = dynamic(async () => (await import("./nav-sidebar-operations")).NavSidebarOperaions);

interface Props {
  item: NavTagItem;
  indices: number[];
  onAddChange?: (changedItem: NavTagItem, newItem: NavTagItem, indices: number[]) => void;
  onDeleteChange?: (item: NavTagItem, indices: number[]) => void;
  onNavItemClick?: (item: NavTagItem, indices: number[]) => void;
  onEditChange?: (changeItem: NavTagItem, indices: number[]) => void;
}

export const NavSidebar = memo(function NavSidebar({ item, onAddChange, indices, onDeleteChange, onNavItemClick, onEditChange }: Props) {
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
            <SidebarMenuButton tooltip={item.title} isActive={item.isActive} className="group/button justify-between">
              <div className="[&>svg]:size-4 [&>svg]:shrink-0 flex items-center justify-start">
                {item.items?.length ? <ChevronRight className="mr-2 transition-transform duration-200 invisible group-hover/root-container:visible group-data-[state=open]/button:rotate-90 float-left" /> : <span className="mr-2 size-4"></span>}
                {item.icon && <item.icon />}
                <span className="cursor-pointer" onClick={() => handleNavItemClick(item, indices)}>{item.title}</span>
              </div>
              <NavSidebarOperaions
                item={item}
                indices={indices}
                onAddChange={onAddChange}
                onDeleteChange={onDeleteChange}
                onEditChange={onEditChange}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent className="[&_ul]:pr-0 [&_ul]:mr-0">
            <SidebarMenuSub>
              {item.items?.map((subItem, idx: number) => (
                subItem?.items?.length && subItem.items.length > 0
                  ? <NavSidebar
                    key={subItem.id}
                    item={subItem}
                    indices={[...indices, idx]}
                    onAddChange={onAddChange}
                    onDeleteChange={onDeleteChange}
                    onNavItemClick={onNavItemClick}
                    onEditChange={onEditChange}
                  />
                  : <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                      <div className="group/button flex justify-between">
                        <span className="cursor-pointer ml-2" onClick={() => handleNavItemClick(subItem, [...indices, idx])}>{subItem.title}</span>
                        <NavSidebarOperaions
                          item={subItem}
                          indices={[...indices, idx]}
                          onAddChange={onAddChange}
                          onDeleteChange={onDeleteChange}
                          onEditChange={onEditChange}
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
});
