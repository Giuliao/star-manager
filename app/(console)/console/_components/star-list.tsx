"use client";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Search } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getStarList } from "@/lib/actions/github";
import type { StarItem } from "@/types/github";
import { useQueryAllData } from "@/lib/hooks/query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {

}


export function StarList({ className }: Props) {

  const [starList, setStarList] = useState<StarItem[]>([]);
  const [searchStr, setSearchStr] = useState("");
  const [pending, startTransition] = useTransition();


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
          return <Card className={cn("w-full p-2 hover:border-solid hover:border-l-sky-500 hover:cursor-pointer")} key={index} >
            <div className="flex gap-1 flex-start text-sm">
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
          </Card>
        })
      }
      {pending && <div>loading....</div>}
    </div>
  );
}
