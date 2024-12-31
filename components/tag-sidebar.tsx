"use client";
import { useState, useEffect } from "react";
import {
  Plus
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { NavSidebar, type NavItem } from "@/components/nav-sidebar";
import { NavPopover } from "@/components/nav-popover";
import { useStarCtx } from "@/lib/context/star";
import { createUserTag, createTag, queryTagByName } from "@/lib/actions/tag";
import type { SessionUser } from "@/types/user";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  sessionUser: SessionUser;
}

export function TagSidebar({ sessionUser }: Props) {
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [, setStarCtx] = useStarCtx()

  useEffect(() => {
    setStarCtx(prev => ({ ...prev, tagList: navItems }));
  }, [navItems])


  const onAddRootTag = async (name: string) => {
    setNavItems(prev => {
      return [...prev, { title: name || "new tag", url: "" }] as NavItem[];
    });

    let tag = await queryTagByName(name);
    if (!tag) {
      tag = (await createTag({
        name: name
      }))?.[0];
    }

    await createUserTag({
      user_id: sessionUser.dbId,
      tag_id: tag.id,
      content: [],
    });

  }

  const onAddTag = async (item: NavItem, indices: number[], idx: number) => {
    setNavItems(prev => {
      if (indices.length === 0) {
        prev[idx] = item;
      } else {
        indices.reduce((acc, cur, idx) => {
          if (idx === indices.length - 1) {
            acc![cur] = item;
            return acc
          }
          return acc![cur]?.items;
        }, prev[idx].items);
      };
      return [...prev];
    });
  }

  return (
    <Sidebar className="absolute w-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group/label">
            Tags
            <NavPopover onAdd={onAddRootTag} >
              <Plus className="ml-2 invisible group-hover/label:visible hover:cursor-pointer active:animate-ping" />
            </NavPopover>
          </SidebarGroupLabel>
          {
            navItems.map((item, idx) => (
              <NavSidebar item={item} key={idx} indices={[]}
                onAddChange={(item, indices) => {
                  onAddTag(item, indices, idx);
                }}
                onDeleteChange={(_, indices) => {
                  setNavItems(prev => {
                    if (indices.length === 0) {
                      return prev.filter((_, i) => i !== idx);
                    }
                    const updatedItems = [...prev];
                    updatedItems[idx] = { ...updatedItems[idx], items: [...updatedItems[idx].items as NavItem[]] };
                    indices.reduce((acc, cur, i) => {
                      if (i === indices.length - 1) {
                        acc!.splice(cur, 1);
                        return acc
                      }
                      acc![cur] = { ...acc![cur], items: [...acc![cur].items as NavItem[]] };
                      return acc![cur]?.items;
                    }, updatedItems[idx].items);

                    return updatedItems;

                  });
                }}
              />
            ))
          }
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
