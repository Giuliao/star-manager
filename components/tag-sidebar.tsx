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
import { NavSidebar } from "@/components/nav-sidebar";
import { NavPopover } from "@/components/nav-popover";
import { useStarCtx } from "@/lib/context/star";
import { cn } from "@/lib/utils";
import {
  createUserTag,
  createTag,
  queryTagByName,
  updateUserTagById,
  deleteUserTagById,
} from "@/lib/actions/tag";
import type { SessionUser } from "@/types/user";
import type { NavTagItem } from "@/types/tag";


type Props = React.HTMLAttributes<HTMLDivElement> & {
  sessionUser: SessionUser;
  initNavItems?: NavTagItem[];
}

export function TagSidebar({ sessionUser, initNavItems, className }: Props) {
  const [navItems, setNavItems] = useState<NavTagItem[]>(initNavItems || []);
  const [starCtx, setStarCtx] = useStarCtx()

  useEffect(() => {
    setStarCtx(prev => ({ ...prev, tagList: navItems }));
  }, [navItems])


  useEffect(() => {
    if (starCtx.selectedTag && starCtx.selectedStar) {
      if (!starCtx.isDeleteTag && starCtx.selectedTag.item.content
        ?.some(c => c === `${starCtx.selectedStar!.owner.login}/${starCtx.selectedStar!.name}`)) {
        return;
      }

      let tag = starCtx.selectedTag;
      setNavItems(prev => {
        let newNavItems = [...prev];
        tag.indices.reduce((acc: NavTagItem[], cur: number, idx: number) => {
          if (idx === tag.indices.length - 1) {
            if (starCtx.isDeleteTag) {
              acc[cur] = {
                ...acc[cur],
                content: [
                  ...(acc[cur].content?.filter(c => c !== `${starCtx.selectedStar!.owner.login}/${starCtx.selectedStar!.name}`
                  ) || []),
                ]
              };
            } else {
              acc[cur] = {
                ...acc[cur],
                content: [
                  ...(acc[cur].content || []),
                  `${starCtx.selectedStar!.owner.login}/${starCtx.selectedStar!.name}`
                ]
              };
            }
            return [];
          }
          acc[cur] = {
            ...acc[cur],
            items: [...(acc[cur].items || [])],
          };
          return acc[cur].items as NavTagItem[];
        }, newNavItems);

        return newNavItems;
      })


      // update database 
      tag.indices.reduce((acc: NavTagItem[], cur: number, idx: number) => {
        if (idx === tag.indices.length - 1) {
          updateUserTagById(
            sessionUser.dbId,
            tag.item.id as string,
            {
              content: starCtx.isDeleteTag
                ? acc[cur].content?.filter(c => c !== `${starCtx.selectedStar!.owner.login}/${starCtx.selectedStar!.name}`)
                : [...(acc[cur].content || []), `${starCtx.selectedStar!.owner.login}/${starCtx.selectedStar!.name}`]
            }
          )
          return [];
        }
        return acc[cur].items as NavTagItem[];
      }, navItems);

    }
  }, [starCtx.selectedTag])


  const onAddRootTag = async (name: string) => {
    let tag = await queryTagByName(name);
    if (!tag) {
      tag = (await createTag({
        name: name
      }))?.[0];
    }
    const result = (await createUserTag({
      user_id: sessionUser.dbId,
      tag_id: tag.id,
      content: [],
    }))?.[0];

    setNavItems(prev => {
      return [...prev, { title: name || "new tag", id: result.id }] as NavTagItem[];
    });


  }

  const onAddTag = async (item: NavTagItem, newItem: NavTagItem, indices: number[], idx: number) => {
    let tag = await queryTagByName(newItem.title);
    if (!tag) {
      tag = (await createTag({
        name: newItem.title
      }))?.[0];
    }
    const result = (await createUserTag({
      user_id: sessionUser.dbId,
      tag_id: tag.id,
      parent_id: newItem.parentId,
      parent_tag_id: newItem.parentTagId,
      content: [],
    }))?.[0];
    newItem.id = result.id;

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
  const onDeleteChange = (item: NavTagItem, indices: number[], idx: number) => {
    setNavItems(prev => {
      if (indices.length === 0) {
        return prev.filter((_, i) => i !== idx);
      }
      const updatedItems = [...prev];
      updatedItems[idx] = { ...updatedItems[idx], items: [...updatedItems[idx].items as NavTagItem[]] };
      indices.reduce((acc, cur, i) => {
        if (i === indices.length - 1) {
          acc!.splice(cur, 1);
          return acc
        }
        acc![cur] = { ...acc![cur], items: [...acc![cur].items as NavTagItem[]] };
        return acc![cur]?.items;
      }, updatedItems[idx].items);

      return updatedItems;
    });


    const getDeleteTag = (item: NavTagItem) => {
      let result: NavTagItem[] = [item];
      if (item.items && item.items.length > 0) {
        result = [...result, ...item.items.map(getDeleteTag).flat()];
      }
      return result;
    }

    setStarCtx(prev => ({
      ...prev,
      deletedTag: getDeleteTag(item)
    }));

    // database action
    deleteUserTagById(sessionUser.dbId, item.id as string);

  }
  const onNavItemClick = (item: NavTagItem, indices: number[]) => {
    let prefix = '';
    indices.reduce((acc: NavTagItem[], cur: number, idx: number) => {
      if (idx === indices.length - 1) {
        return []
      }
      prefix = `${prefix}${acc[cur].title}/`;
      return acc[cur].items as NavTagItem[];
    }, navItems);

    setStarCtx((prev) => ({ ...prev, selectedSidebarTag: { ...item, title: `${prefix}${item.title}` } }));
  }

  const onEditChange = async (newItem: NavTagItem, indices: number[], idx: number) => {
    let tag = await queryTagByName(newItem.title);
    if (!tag) {
      tag = (await createTag({
        name: newItem.title
      }))?.[0];
    }

    updateUserTagById(sessionUser.dbId, newItem.id as string, {
      user_id: sessionUser.dbId,
      tag_id: tag.id,
      parent_id: newItem.parentId,
      parent_tag_id: newItem.parentTagId,
      content: [...(newItem.content || [])],
    });

    setNavItems(prev => {
      if (indices.length === 0) {
        prev[idx] = newItem;
      } else {
        indices.reduce((acc, cur, idx) => {
          if (idx === indices.length - 1) {
            acc![cur] = newItem;
            return acc
          }
          return acc![cur]?.items;
        }, prev[idx].items);
      };
      return [...prev];
    });

    setStarCtx(prev => ({
      ...prev,
      editedTag: newItem
    }));
  }

  return (
    <Sidebar className={cn("absolute w-full", className)}>
      <SidebarContent className="group/root-container">
        <SidebarGroup>
          <SidebarGroupLabel className="group/label">
            Tags
            <NavPopover onAdd={onAddRootTag} alignOffest={0} >
              <Plus className="ml-2 hover:cursor-pointer active:animate-ping" />
            </NavPopover>
          </SidebarGroupLabel>
          {
            navItems.map((item, idx) => (
              <NavSidebar item={item} key={idx} indices={[]}
                onAddChange={(item, newItem, indices) => {
                  onAddTag(item, newItem, indices, idx);
                }}
                onDeleteChange={(item, indices) => { onDeleteChange(item, indices, idx) }}
                onNavItemClick={(item, indices) => onNavItemClick(item, [idx, ...indices])}
                onEditChange={(item, indices) => onEditChange(item, indices, idx)}
              />
            ))
          }
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}


export function TagSiderBarLoading() {
  return (
    <Sidebar className="absolute w-full">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group/label">
            Tags
          </SidebarGroupLabel>
          loading...
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>


  )
}
