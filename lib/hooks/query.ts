"use client";
import { useState, useEffect } from 'react';
import { sleep } from "@/lib/utils";

export type QueryFunc<T = any> = (param: any) => Promise<T>;
export type ParseFunc<T = any, E = any> = (arg: T) => E;

export function useQueryAllData<T = any>(
  queryFunc: QueryFunc,
  parseFunc: ParseFunc,
  params = { per_page: 20, page: 1 },
  waitTime = 500
) {

  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    (async () => {
      let pagesRemaining = true;
      const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
      const perPagePattern = /per_page=(\d+)/i;
      const pagePattern = /&page=(\d+)/i;
      let param = params;

      while (pagesRemaining) {
        const response = await queryFunc(param);
        const parsedData = parseFunc(response);
        setData(data => [...parsedData]);

        const linkHeader = response.headers.link;
        pagesRemaining = linkHeader && linkHeader.includes(`rel=\"next\"`);

        if (pagesRemaining) {
          const url = linkHeader.match(nextPattern)[0];
          const perPage = parseInt(url.match(perPagePattern)[1]);
          const page = parseInt(url.match(pagePattern)[1]);
          param = {
            per_page: perPage,
            page: page
          };
        }

        await sleep(waitTime);
      }
    })();

  }, []);

  return [data, setData];
}
