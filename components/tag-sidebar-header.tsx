import { useState } from 'react';
import { LayoutGrid, Bookmark, Tag } from "lucide-react";
import type { NavTagItem } from "@/types/tag";
import { SidebarMenuButton, SidebarMenu } from "@/components/ui/sidebar";
import { useStarCtx } from "@/lib/context/star";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  onNavItemClick?: (item: NavTagItem, indices: number[]) => void
}
export enum TagSidebarHeaderConst {
  AllRepos = "All Repos",
  UntagRepos = "Untag Repos"
}

export function TagSidebarHeader({ onNavItemClick }: Props) {
  const [starCtx] = useStarCtx();
  const [sidebarHeaderList, setSidebarHeaderList] = useState<NavTagItem[]>([
    {
      id: TagSidebarHeaderConst.AllRepos,
      title: TagSidebarHeaderConst.AllRepos,
      items: [],
      parentId: null,
      isActive: false,
      icon: LayoutGrid
    },
    {
      id: TagSidebarHeaderConst.UntagRepos,
      title: TagSidebarHeaderConst.UntagRepos,
      items: [],
      parentId: null,
      isActive: false,
      icon: Bookmark
    }
  ]);

  return (
    <SidebarMenu className="p-2">
      {
        sidebarHeaderList.map((item, idx) => (
          <SidebarMenuButton key={idx} onClick={() => onNavItemClick?.(item, [])} className="w-full flex justify-between items-center cursor-pointer \
           text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            <div className="flex justify-start items-center gap-2">
              {item.icon && <item.icon className="size-4" />}{item.title}
            </div>
            {item.id === 'All Repos' ? starCtx.numOfStarItems || 0 : starCtx.numOfUntagStarItems || 0}
          </SidebarMenuButton>
        ))
      }
    </SidebarMenu>
  )
}
