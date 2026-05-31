import { NextResponse, NextRequest } from "next/server";
import { getStarList } from '@/lib/actions/github';
import { auth } from "@/auth";
import { captureServerEvent } from "@/lib/analytics/server";
import {
  AnalyticsEvents,
  getAnalyticsDistinctId
} from "@/lib/analytics/events";
import type { SessionUser } from "@/types/user";

export const maxDuration = 30;

async function* makeIterator(
  param: { per_page: number, page: number },
  distinctId?: string
) {
  let pagesRemaining = true;
  let pageCount = 0;
  let starCount = 0;
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  const perPagePattern = /per_page=(\d+)/i;
  const pagePattern = /&page=(\d+)/i;

  try {
    while (pagesRemaining) {
      const response = await getStarList(param);
      pageCount += 1;
      starCount += Array.isArray(response.data) ? response.data.length : 0;
      yield response.data;
      const linkHeader = response.headers.link || "";
      pagesRemaining = !!(linkHeader && linkHeader.includes(`rel=\"next\"`));
      if (pagesRemaining) {
        const url = linkHeader.match(nextPattern)![0];
        const perPage = parseInt(url.match(perPagePattern)![1]);
        const page = parseInt(url.match(pagePattern)![1]);
        param = {
          per_page: perPage,
          page: page
        };
      }
    }
    void captureServerEvent(AnalyticsEvents.GithubStarsSyncCompleted, distinctId, {
      page_count: pageCount,
      star_count: starCount
    });
  } catch (error) {
    void captureServerEvent(AnalyticsEvents.GithubStarsSyncFailed, distinctId, {
      page_count: pageCount,
      star_count: starCount
    });
    throw error;
  }
}

function iteratorToStream(iterator: any, req?: NextRequest) {
  return new ReadableStream({
    async pull(controller) {

      const handleAbort = () => {
        controller.close();
      }
      const { value, done } = await iterator.next()
      if (done) {
        controller.close();
        if (req?.signal) {
          req.signal.removeEventListener('abort', handleAbort);
        }

      } else {
        controller.enqueue(`${JSON.stringify(value)}\n`);
      }

      if (req?.signal) {
        req.signal.addEventListener("abort", handleAbort);
      }
    },
  })
}

export async function GET(req: NextRequest) {
  const sess = await auth() as any;
  const distinctId = getAnalyticsDistinctId(
    (sess?.user as SessionUser | undefined)?.dbId
  );
  if (!sess || !sess.user) {
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue("You need to be authenticated to use this feature");
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text-plain; charset=utf-8"
      }
    })
  }


  const params = req.nextUrl.searchParams;
  const per_page = parseInt(params.get('per_page') || '');
  const page = parseInt(params.get('page') || '');
  if (Number.isNaN(per_page) || Number.isNaN(page)) {
    return NextResponse.json({ message: "per_page and page are required" });
  }

  let param = { per_page, page };
  void captureServerEvent(AnalyticsEvents.GithubStarsSyncStarted, distinctId, {
    per_page,
    page
  });
  const iter = makeIterator(param, distinctId)
  const stream = iteratorToStream(iter);
  return new Response(stream)
}
