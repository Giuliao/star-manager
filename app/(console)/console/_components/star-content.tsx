"use server";
import { Buffer } from "node:buffer";
import Link from "next/link";
import Image from "next/image";
import { cookies } from 'next/headers';
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import sanitizeHtml from "sanitize-html";
import remarkGfm from "remark-gfm";
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getREADME } from '@/lib/actions/github';
import { cn } from "@/lib/utils";
import { PreComp } from "@/components/pre-comp";
import { FloatTip } from '@/components/float-tip'

export async function StarContent() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const repo = cookieStore.get("repo")?.value;

  if (!repo || !owner) {
    return (
      <div className="w-full h-screen p-4 overflow-y-auto flex justify-center items-center">
        No Data
      </div>
    )
  }

  const resp = await getREADME({
    owner: owner,
    repo: repo,
  });
  const markdown = Buffer.from(resp.data.content, "base64").toString("utf8");
  const mdStr = sanitizeHtml(markdown as string, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: sanitizeHtml.defaults.allowedAttributes.img.concat(["align"]),
    },
  });

  const components = {
    a: (props: any) => (
      <Link
        className="text-blue-500 hover:underline inline-block"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      />
    ),
    h1: (props: any) => (
      <>
        <h1
          className="scroll-mt-16 py-4 text-lg font-bold"
          id={props.children}
          {...props}
        />
        <hr />
      </>
    ),
    h2: (props: any) => (
      <h2
        className="scroll-mt-16 py-2"
        id={props.children}
        {...props}
      />
    ),
    h3: (props: any) => (
      <h3 className="scroll-mt-16" id={props.children} {...props} />
    ),
    p: (props: any) => <p className="text-sm relative" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-4 py-1" {...props} />,
    li: (props: any) => <li className="space-y-2 py-1" {...props} />,
    code: (props: any) => (
      <code
        className={cn(
          "px-1 rounded-md inline group-[.is-pre]:block overflow-x-auto",
          props.className
        )}
        {...props}
      ></code>
    ),
    img: (props: any) => {

      let imageSrc = props.src;
      if (imageSrc.startsWith(".")) {
        imageSrc = imageSrc.replace(".", `https://github.com/${owner}/${repo}/raw/main/`);
      } else if (!imageSrc.startsWith("http://") && !imageSrc.startsWith("https://")) {
        imageSrc = imageSrc = `https://raw.githubusercontent.com/${owner}/${repo}/master/${imageSrc}`;
      }

      return (<Image
        unoptimized
        {...props}
        src={imageSrc}
        fill
        style={{
        }}
        className={cn("min-w-4 min-h-4 !relative object-contain !w-auto inline-block", props.className)}
        alt={props.alt.trim() || "?"}
      />);
    },
    pre: PreComp,
    table: (props: any) => (
      <table
        className={cn(
          "w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded-md overflow-hidden",
          props.className
        )}
        {...props}
      />
    ),
    tr: (props: any) => (
      <tr
        className={cn(
          "bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600",
          props.className
        )}
        {...props}
      ></tr>
    ),
    th: (props: any) => (
      <th className={cn("p-2", props.className)} {...props}></th>
    ),
    td: (props: any) => (
      <td className={cn("p-2", props.className)} {...props}></td>
    ),
  };



  return (
    <div className="w-full h-[85vh] sm:h-screen p-4 overflow-y-auto relative">
      <MDXRemote source={mdStr}
        components={components}
        options={{
          mdxOptions: {
            format: "md",
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          }
        }} />
      <FloatTip
        key={`${repo}-${owner}`}
        className={cn("fixed bottom-4 right-4 rounded-lg w-5 h-3 shadow-lg backdrop-blur-sm bg-white/60",
          "transition-all ease-in-out duration-500 hover:w-[90vw] hover:sm:w-[600px] hover:h-2/3",
          "overflow-visible border-[0.5px] border-gray-300"
        )}
        markdownStr={markdown}
      />
    </div>
  );
}


export type StartContentType = typeof StarContent;
