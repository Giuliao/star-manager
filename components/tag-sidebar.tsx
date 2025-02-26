"use client";
import {
  useState,
  useEffect,
  useTransition,
  useCallback,
  memo
} from "react";
import {
  LoaderCircle,
  Plus,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { NavSidebar } from "@/components/nav-sidebar";
import { NavPopover } from "@/components/nav-popover";
import { TagSidebarHeader } from "@/components/tag-sidebar-header";
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
import {
  addTagList,
  selectedStar as _ctxSelectedStar,
  selectedTag as _ctxSelectedTag,
  selectedIsDeleteTag as _ctxSelectedIsDeleteTag,
  setDeletedTag,
  setEditedTag,
  setSelectedSidebarTag,
} from "@/lib/store/star-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-store";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  sessionUser: SessionUser;
  initNavItems?: NavTagItem[];
}

export function TagSidebar({ sessionUser, initNavItems, className }: Props) {
  const [navItems, setNavItems] = useState<NavTagItem[]>(initNavItems || []);
  const [pending, startTransition] = useTransition();
  const [selectedIdxs, setSelectedIdxs] = useState<number[]>([]);
  const dispath = useAppDispatch();
  const ctxSelectedStar = useAppSelector(_ctxSelectedStar);
  const ctxSelectedTag = useAppSelector(_ctxSelectedTag);
  const ctxIsDeleteTag = useAppSelector(_ctxSelectedIsDeleteTag);

  useEffect(() => {
    dispath(addTagList(navItems));
  }, [navItems])


  useEffect(() => {
    if (ctxSelectedTag && ctxSelectedStar) {
      if (!ctxIsDeleteTag && ctxSelectedTag.item.content
        ?.some(c => c === `${ctxSelectedStar!.owner.login}/${ctxSelectedStar!.name}`)) {
        return;
      }

      let tag = ctxSelectedTag;
      setNavItems(prev => {
        let newNavItems = [...prev];
        tag.indices.reduce((acc: NavTagItem[], cur: number, idx: number) => {
          if (idx === tag.indices.length - 1) {
            if (ctxIsDeleteTag) {
              acc[cur] = {
                ...acc[cur],
                content: [
                  ...(acc[cur].content?.filter(c => c !== `${ctxSelectedStar!.owner.login}/${ctxSelectedStar!.name}`
                  ) || []),
                ]
              };
            } else {
              acc[cur] = {
                ...acc[cur],
                content: [
                  ...(acc[cur].content || []),
                  `${ctxSelectedStar!.owner.login}/${ctxSelectedStar!.name}`
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
              content: ctxIsDeleteTag
                ? acc[cur].content?.filter(c => c !== `${ctxSelectedStar!.owner.login}/${ctxSelectedStar!.name}`)
                : [...(acc[cur].content || []), `${ctxSelectedStar!.owner.login}/${ctxSelectedStar!.name}`]
            }
          )
          return [];
        }
        return acc[cur].items as NavTagItem[];
      }, navItems);

    }
  }, [ctxSelectedTag])


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
        return [...prev, { title: name || "new tag", id: result.id, items: [] }] as NavTagItem[];
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

      setNavItems(items => {
        let prev = [...items];
        if (indices.length === 0) {
          prev[idx] = item;
        } else {
          prev[idx] = {
            ...prev[idx],
            items: [...(prev[idx].items || [])],
          };

          indices.reduce((acc, cur, idx) => {
            if (idx === indices.length - 1) {
              acc![cur] = item;
              return acc
            }
            acc![cur] = {
              ...acc![cur],
              items: [...(acc![cur].items || [])],
            };

            return acc![cur]?.items;
          }, prev[idx].items);
        };
        return prev;
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

    dispath(setDeletedTag(getDeleteTag(item)));

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

    dispath(setSelectedSidebarTag({ ...item, title: `${prefix}${item.title}` }));
    setNavItems(items => {
      const prev = [...items];
      // deactive prev one
      selectedIdxs.reduce((acc, cur, idx) => {
        if (idx === selectedIdxs.length - 1 && acc[cur]) {
          acc[cur] = {
            ...acc[cur],
            isActive: false
          };

          return acc;
        }
        acc = [...acc.slice(0, cur), { ...acc[cur], items: [...(acc[cur].items || [])] }, ...acc.slice(cur)]
        return acc?.[cur]?.items || [];
      }, prev)

      // active current one
      indices.reduce((acc: NavTagItem[], cur: number, idx: number): NavTagItem[] => {
        if (idx === indices.length - 1) {
          acc[cur] = {
            ...acc[cur],
            isActive: true
          }
          return acc;
        }
        acc = [...acc.slice(0, cur), { ...acc[cur], items: [...(acc[cur].items || [])] }, ...acc.slice(cur)]
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

    setNavItems(items => {
      const prev = [...items];
      if (indices.length === 0) {
        prev[idx] = newItem;
      } else {
        prev[idx] = {
          ...prev[idx],
          items: [...(prev[idx].items || [])],
        };

        indices.reduce((acc, cur, idx) => {
          if (idx === indices.length - 1) {
            acc![cur] = newItem;
            return acc
          }

          acc![cur] = {
            ...acc![cur],
            items: [...(acc![cur].items || [])],
          };

          return acc![cur]?.items;
        }, prev[idx].items);
      };
      return prev;
    });

    dispath(setEditedTag(newItem));
  }

  return (
    <Sidebar modal={false} className={cn("absolute w-full", className)}>
      <TagSidebarHeader onNavItemClick={onNavItemClick} />
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
