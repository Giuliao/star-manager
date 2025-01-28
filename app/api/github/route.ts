import { NextResponse, NextRequest } from "next/server";
import { getStarList } from '@/lib/actions/github';
import { isNumber } from "util";
import { auth } from "@/auth";


async function* makeIterator(param: { per_page: number, page: number }) {
  let pagesRemaining = true;
  const nextPattern = /(?<=<)([\S]*)(?=>; rel="Next")/i;
  const perPagePattern = /per_page=(\d+)/i;
  const pagePattern = /&page=(\d+)/i;

  while (pagesRemaining) {
    const response = await getStarList(param);
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
  if (!isNumber(per_page) || !isNumber(page)) {
    return NextResponse.json({ message: "per_page and page are required" });
  }

  let param = { per_page, page };
  const iter = makeIterator(param)
  const stream = iteratorToStream(iter);
  return new Response(stream)
}
