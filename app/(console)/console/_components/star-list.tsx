"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactElement, ReactNode, useEffect, useState, useTransition, useMemo } from "react";
import { Hash, Trash2, Ellipsis } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TagPopover } from "@/components/tag-popover";
import { getStarList } from "@/lib/actions/github";
import type { StarItem } from "@/types/github";
import type { FlatTagType, NavTagItem } from "@/types/tag";
import { useQueryGithubStarStream } from "@/lib/hooks/query";
import { useTagList, parseNavItem } from "@/lib/hooks/use-taglist";
import { SearchControl } from "./search-control";
import { StarListDrawer } from "./star-list-drawer";
import { useSidebar } from "@/components/ui/sidebar"
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useDidUpdateEffect } from "@/lib/hooks/use-did-update-effect";
import { TagSidebarHeaderConst } from "@/components/tag-sidebar-header";
import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-store";
import {
  addNumOfStarItems,
  addNumOfUntagStarItems,
  selectedStar as _ctxSelectedStar,
  selectedDeletedTag as _ctxDeletedTag,
  selectedEditedTag as _ctxEditedTag,
  setSelectedStar as setCtxSelectedStar,
  setSelectedTag as setCtxSelectedTag,
  setIsDeleteTag as setCtxIsDeleteTag,
  setDeletedTag as setCtxDeletedTag,
  setContentRefresh as setCtxContentRefresh
} from '@/lib/store/star-slice';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  initNavItems?: NavTagItem[];
  StarContentComp?: ReactElement | ReactNode;
}

export function StarList({ className, initNavItems, StarContentComp }: Props) {

  const [starList, setStarList] = useState<StarItem[]>([]);
  const [searchStr, setSearchStr] = useState("");
  const [searchTag, setSearchTag] = useState<FlatTagType[]>([]);
  const [pending, startTransition] = useTransition();
  const [refreshing, startRefreshing] = useTransition();
  const [selectedStar, setSelectedStar] = useState<StarItem>();
  const router = useRouter();
  const [tagList] = useTagList();
  const [parsedTagList] = useState(parseNavItem(initNavItems || []));
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();
  const ctxSelectedStar = useAppSelector(_ctxSelectedStar);
  const ctxDeletedTag = useAppSelector(_ctxDeletedTag);
  const ctxEditedTag = useAppSelector(_ctxEditedTag);

  useDidUpdateEffect(() => {
    document.cookie = `isMobile=${isMobile};path=/`;
    router.refresh();
  }, [isMobile])


  const initTagData = (item: StarItem) => {
    parsedTagList.forEach(tag => {
      if (tag.item.content?.some(v => v === `${item.owner.login}/${item.name}`)) {
        item.tags = [
          ...(item.tags || []),
          tag
        ]
      }
    })
    return item
  }

  useEffect(() => {
    (async () => {
      const resp = (await getStarList({ per_page: 20, page: 1 }).catch(err => {
        console.error(err);
        return { data: [] };
      }));
      const starItems = (resp.data as StarItem[]).map(initTagData) as StarItem[];
      setStarList(prev => [...starItems, ...prev]);
      dispatch(addNumOfStarItems(starItems.length));
      dispatch(addNumOfUntagStarItems(starItems.filter(item => !item.tags?.length).length));
    })();
  }, []);

  const [newData] = useQueryGithubStarStream({ per_page: 20, page: 2 });
  useEffect(() => {
    startTransition(() => {
      const newStarItems = (newData as StarItem[]).map(initTagData);
      setStarList(data => [...data, ...newStarItems] as StarItem[]);
      dispatch(addNumOfStarItems(newStarItems.length));
      dispatch(addNumOfUntagStarItems(newStarItems.filter(item => !item.tags?.length).length));
    });
  }, [newData]);

  useEffect(() => {
    if (ctxDeletedTag) {
      setStarList(prev => {
        return prev.map((item) => {
          let newItem = {
            ...item
          }
          ctxDeletedTag?.forEach((tag) => {
            if (item.tags?.some(t => t.item.id === tag.id)) {
              newItem = {
                ...newItem,
                tags: [
                  ...item.tags.filter(t => t.item.id !== tag.id)
                ]
              };
            }
          })
          return newItem;
        })
      });
      dispatch(setCtxDeletedTag(undefined));
    }
  }, [ctxDeletedTag]);

  useEffect(() => {
    if (ctxEditedTag) {
      setStarList(prev => {
        return prev.map(item => {
          const idx = item.tags?.findIndex((tag) => tag.item.id === ctxEditedTag?.id);
          if (idx !== undefined && idx !== null && idx >= 0) {
            const originTagItem = item.tags![idx];
            const lastIdx = originTagItem.name.lastIndexOf(item.tags![idx].item.title);

            return {
              ...item,
              tags: [
                ...(item.tags?.slice(0, idx) || []),
                {
                  ...originTagItem,
                  name: `${originTagItem.name.slice(0, lastIdx)}${ctxEditedTag?.title}`,
                  item: {
                    ...ctxEditedTag
                  }
                },
                ...(item.tags?.slice(idx + 1) || [])
              ]
            }
          }
          return item;
        }) as StarItem[];
      });
    }
  }, [ctxEditedTag])

  const filteredStarList = useMemo(() => {
    if (searchTag[0]?.item.id === TagSidebarHeaderConst.AllRepos) {
      return starList.filter(item => searchStr || item.name.includes(searchStr));
    }

    if (searchTag[0]?.item.id === TagSidebarHeaderConst.UntagRepos) {
      return starList.filter(item => !item.tags?.length)
        .filter(item => !searchStr || item.name.includes(searchStr));
    }

    return starList
      .filter((item) => !searchTag.length ||
        searchTag.some((tag) => item.tags?.some(t => t.name === tag.name)))
      .filter(item => !searchStr || item.name.includes(searchStr))
  },
    [starList, searchStr, searchTag]);

  const onSearchInputChange = useDebounce((evt: any) => {
    setSearchStr(evt?.target?.value as string);
  }, 500)

  const onClick = (item: StarItem) => {
    if (ctxSelectedStar?.name === item.name && ctxSelectedStar.owner.login === item.owner.login) {
      return;
    }
    setSelectedStar(item);
    dispatch(setCtxSelectedStar(item));
    document.cookie = `owner=${item.owner.login};path=/`;
    document.cookie = `repo=${item.name};path=/`;
    startRefreshing(() => {
      router.push("/console/" + encodeURIComponent(`${item.owner.login}/${item.name}`));
    });
  };
  useEffect(() => {
    dispatch(setCtxContentRefresh(refreshing));
  }, [refreshing]);

  const onAddTag = (item: FlatTagType, starItem: StarItem) => {
    const idx = starList.findIndex((item) => item.id === starItem.id);
    if (starList[idx].tags?.some((tag) => tag.name === item.name)) {
      return;
    }

    setStarList(prev => {
      const newStarList = [...prev.slice(0, idx), { ...prev[idx], tags: [...prev[idx].tags || [], item] }, ...prev.slice(idx + 1)];
      return newStarList;
    });

    dispatch(setCtxSelectedStar({ ...ctxSelectedStar, tags: [...(ctxSelectedStar?.tags || []), item] } as StarItem));
    dispatch(setCtxSelectedTag(item));
    dispatch(setCtxIsDeleteTag(false));
  }

  const onRemoveTag = (item: FlatTagType, starItem: StarItem) => {
    const idx = starList.findIndex((item) => item.id === starItem.id);

    setStarList(prev => {
      const newStarList = [
        ...prev.slice(0, idx),
        { ...prev[idx], tags: [...prev[idx].tags?.filter(t => t.name !== item.name) || []] },
        ...prev.slice(idx + 1)
      ];
      return newStarList;
    });

    dispatch(setCtxSelectedStar({ ...ctxSelectedStar, tags: [...(ctxSelectedStar?.tags?.filter(t => t.name !== item.name) || [])] } as StarItem));
    dispatch(setCtxSelectedTag(item));
    dispatch(setCtxIsDeleteTag(true));
  }


  return (
    <ScrollArea className="h-screen relative">
      <div className={cn("flex items-center justify-start flex-col p-2 gap-3 relative", className)}>
        <SearchControl
          onTagChange={setSearchTag}
          onInputChange={onSearchInputChange} />
        {
          filteredStarList.map((item: StarItem, index: number) => {
            return (
              <Card
                className={cn(
                  "animate-in duration-300 fade-in slide-in-from-top-10 rounded-lg w-full p-2 hover:border-solid hover:border-l-gray-300 hover:border-l-2  hover:cursor-pointer",
                  selectedStar?.name === item.name && selectedStar.owner.login === item.owner.login ? "border-2 border-blue-300 hover:border-blue-300" : ""
                )}
                onClick={() => onClick(item)}
                key={index}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-1 flex-start text-sm break-all items-center">
                    <Link href={item.owner.html_url} className="hover:underline" target="_blank">
                      {item.owner.login}
                    </Link>
                    /
                    <Link href={item.html_url} className="hover:underline" target="_blank">
                      {item.name}
                    </Link>
                  </div>

                  {isMobile &&
                    <StarContentDrawer StarContentComp={StarContentComp}>
                      <Ellipsis className="float-right w-4 h-4" />
                    </StarContentDrawer>}
                </div>
                <div className="text-xs break-all cursor-text">
                  {item.description}
                </div>
                <div className="flex flex-wrap items-center mt-2 gap-2">
                  {
                    item?.tags?.map((tag, i) => (
                      <div className="animate-in fade-in slide-in-from-left-5 duration-300 cursor-text bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-lg max-w-80 group flex justify-start items-center" key={i}>
                        {tag.name}
                        <Trash2 className="transition-[width] ease-in-out duration-300 w-0 h-3.5 group-hover:w-3.5 ml-1 cursor-pointer"
                          onClick={() => onRemoveTag(tag, item)} />
                      </div>
                    ))
                  }
                  <TagPopover tagList={tagList as FlatTagType[]} onAdd={(tag) => onAddTag(tag, item)}>
                    <Button variant="outline" className="w-5 h-5 p-1 bg-gray-300">
                      <Hash className="bg-gray-200" />
                    </Button>
                  </TagPopover>
                </div>
              </Card>
            )
          })
        }
        {filteredStarList.length || pending ? "" : <div className="flex justify-center items-center text-[hsl(var(--muted))]">No Data</div>}
        {pending && <div>loading....</div>}
      </div>
    </ScrollArea>
  );
}

function StarContentDrawer({ children, StarContentComp }: React.HTMLAttributes<HTMLDivElement> & { StarContentComp?: ReactElement | ReactNode }) {
  return <StarListDrawer
    StarContentComp={StarContentComp}
  >
    {children}
  </StarListDrawer>

}

