"use client";
import { useState, useEffect } from 'react';
import { sleep } from "@/lib/utils";

export type QueryFunc<T = any> = (param: any) => Promise<T>;
export type ParseFunc<T = any, E = any> = (arg: T) => E;

export function useQueryGithubStarStream<T = any>(
  params = { per_page: 20, page: 1 },
  abortSignal?: AbortSignal
) {
  const [data, setData] = useState<T[]>([]);

  useEffect(() => {
    const abortCtl = new AbortController();
    (async () => {
      try {
        const response = await fetch(`/api/github?per_page=${params.per_page}&page=${params.page}`, {
          method: "GET",
          signal: abortSignal || abortCtl.signal
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (reader) {
          let partialChunk = ""; // For handling split JSON strings across chunks
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            partialChunk += decoder.decode(value, { stream: true });
            let boundary = partialChunk.lastIndexOf("\n");
            if (boundary !== -1) {
              // Process complete JSON strings
              const completeChunks = partialChunk.slice(0, boundary).split("\n");
              partialChunk = partialChunk.slice(boundary + 1); // Save the remainder for the next chunk

              for (const chunk of completeChunks) {
                if (chunk.trim()) {
                  const parsed = JSON.parse(chunk);
                  setData([...parsed])
                }
              }
            }
          }
        }
      } catch (err) {
        if ((err as any).name === 'AbortError') {
          console.log(err);
        } else {
          console.error(err)
        }
      }
    })();

    return () => {
      abortCtl.abort();
    }
  }, [])

  return [data, setData];
}

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
