"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search, Hash } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TagPopover } from "@/components/tag-popover";
import { getStarList } from "@/lib/actions/github";
import type { StarItem, FlatTagType } from "@/types/github";
import { useQueryAllData } from "@/lib/hooks/query";
import { useStarCtx } from "@/lib/context/star";
import { useTagList } from "@/lib/hooks/use-taglist";

interface Props extends React.HTMLAttributes<HTMLDivElement> {

}


export function StarList({ className }: Props) {

  const [starList, setStarList] = useState<StarItem[]>([]);
  const [searchStr, setSearchStr] = useState("");
  const [pending, startTransition] = useTransition();
  const [selectedStar, setSelectedStar] = useState<StarItem>();
  const [, setStarCtx] = useStarCtx();
  const router = useRouter();
  const [tagList] = useTagList();

  useEffect(() => {
    (async () => {
      const resp = (await getStarList({ per_page: 20, page: 1 }).catch(err => {
        console.error(err);
        return { data: [] };
      }));
      setStarList(resp.data as StarItem[]);
    })()
  }, []);

  const [newData] = useQueryAllData(
    async (param: any) => await getStarList(param),
    (resp: any) => resp.data,
    { per_page: 20, page: 2 }
  );


  useEffect(() => {
    startTransition(() => {
      setStarList(data => [...data, ...(newData as StarItem[])] as StarItem[]);
    });
  }, [newData]);


  const onClick = (item: StarItem) => {
    setSelectedStar(item);
    document.cookie = `owner=${item.owner.login};path=/`;
    document.cookie = `repo=${item.name};path=/`;
    router.refresh();
    setStarCtx(prevCtx => ({ ...prevCtx, selectedStar: item }));
  };


  const onAddTag = (item: FlatTagType, starItem: StarItem) => {
    const idx = starList.findIndex((item) => item.id === starItem.id);
    if (starList[idx].tags?.some((tag) => tag.name === item.name)) {
      return;
    }

    setStarList(prev => {
      const newStarList = [...prev.slice(0, idx), { ...prev[idx], tags: [...prev[idx].tags || [], item] }, ...prev.slice(idx + 1)];
      return newStarList;
    });
  }


  return (
    <div className={cn("flex items-center justify-start flex-col p-2 gap-3 h-screen overflow-y-auto", className)}>
      <div className="flex gap-2 justify-start w-full items-center">
        <Input className="flex-1" onChange={(evt) => setSearchStr(evt?.target?.value as string)} />
        <Button className="outline" size="icon">
          <Search className="hover:cursor-pointer" />
        </Button>
      </div>
      {
        starList.filter(item => !searchStr || item.name.includes(searchStr)).map((item: StarItem, index: number) => {
          return <Card
            className={cn(
              "rounded-lg w-full p-2 hover:border-solid hover:border-l-gray-300 hover:border-l-2  hover:cursor-pointer",
              selectedStar?.name === item.name && selectedStar.owner.login === item.owner.login ? "border-2 border-blue-300 hover:border-blue-300" : ""
            )}
            onClick={() => onClick(item)}
            key={index}
          >
            <div className="flex gap-1 flex-start text-sm break-all">
              <Link href={item.owner.html_url} className="hover:underline" target="_blank">
                {item.owner.login}
              </Link>
              /
              <Link href={item.html_url} className="hover:underline" target="_blank">
                {item.name}
              </Link>
            </div>
            <div className="text-xs break-all">
              {item.description}
            </div>
            <div className="flex flex-wrap items-center mt-2 gap-2">
              {
                item?.tags?.map((tag, i) => (
                  <div className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-lg max-w-40" key={i}>
                    {tag.name}
                  </div>
                ))
              }
              <TagPopover tagList={tagList as FlatTagType[]} onAdd={(tag) => onAddTag(tag, item)}>
                <Button variant="outline" className="w-5 h-5 p-1 bg-gray-300 active:animate-ping">
                  <Hash className="bg-gray-200" />
                </Button>
              </TagPopover>
            </div>
          </Card>
        })
      }
      {pending && <div>loading....</div>}
    </div>
  );
}
