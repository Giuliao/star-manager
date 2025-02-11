"use client";
import { useState, useEffect, useTransition } from "react";
import {
  LoaderCircle,
  Plus,
  LayoutGrid,
  Bookmark
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
  const [starCtx, setStarCtx] = useStarCtx();
  const [pending, startTransition] = useTransition();
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);

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


  const onAddRootTag = (name: string) => {
    startTransition(async () => {
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
    });
  }

  const onAddTag = (item: NavTagItem, newItem: NavTagItem, indices: number[], idx: number) => {
    startTransition(async () => {
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

    let refreshedSelectedIdxs = [];
    const newIdxs = [idx, ...indices];
    for (let i = 0; i < newIdxs.length; i++) {
      if (selectedIdxs.length > i && selectedIdxs[i] > idx && i === newIdxs.length - 1) {
        refreshedSelectedIdxs.push(selectedIdxs[i] - 1);
      } else {
        refreshedSelectedIdxs.push(selectedIdxs[i]);
      }
    }
    setSelectedIdxs(refreshedSelectedIdxs);

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
    setNavItems(prev => {
      // deactive prev one
      selectedIdxs.reduce((acc, cur, idx) => {
        if (idx === selectedIdxs.length - 1 && acc[cur]) {
          acc[cur].isActive = false;
          return acc;
        }
        return acc?.[cur]?.items || [];
      }, prev)

      // active current one
      indices.reduce((acc: NavTagItem[], cur: number, idx: number): NavTagItem[] => {
        if (idx === indices.length - 1) {
          acc![cur].isActive = true;
          return acc;
        }
        return acc[cur].items || [];
      }, prev);

      return [...prev];
    });
    setSelectedIdxs(indices);
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
    <Sidebar modal={false} className={cn("absolute w-full", className)}>
      <div className="p-2">
        <div id="1" className="w-full h-8 p-2 px-4 flex justify-between items-center cursor-pointer \
           text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <div className="flex justify-start items-center gap-2">
            <LayoutGrid className="h-4 w-4" />All Repos
          </div>
          {starCtx.numOfStarItems || 0}
        </div>
        <div id="2" className="w-full h-8 p-2 px-4 flex justify-between items-center cursor-pointer \
          text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <div className="flex justify-start items-center gap-2">
            <Bookmark className="h-4 w-4" />Untag Repos
          </div>
          {starCtx.numOfUntagStarItems || 0}
        </div>
      </div>
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
          {pending && <div className="flex items-center justify-start p-2"><LoaderCircle className="animate-spin w-4 h-4" /></div>}
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
