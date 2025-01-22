import { Suspense } from "react";
import { cookies } from "next/headers";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { DynamicPanel } from "@/components/dynamic-panel";
import { TagSidebar } from "@/components/tag-sidebar";
import { StarList } from "./_components/star-list";
import { StarContent } from "./_components/star-content";
import { auth } from "@/auth";
import { listUserTagById } from "@/lib/actions/tag";
import { SessionUser } from "@/types/user";
import { parseTagData } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Console() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const repo = cookieStore.get("repo")?.value;
  const isMobile = cookieStore.get("isMobile")?.value === 'true';
  const session = await auth();
  const results = await listUserTagById((session?.user as SessionUser).dbId);
  const parsedTagData = parseTagData(results);

  const WrapStarContent = () => {
    return (
      <Suspense key={`${owner}-${repo}`} fallback={<StartContentLoading />}>
        <StarContent key={`${owner}-${repo}`} />
      </Suspense>
    )
  }

  return (
    <main className="flex-1 flex min-h-screen w-screen flex-col items-center justify-between">
      <DynamicPanel />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1">
        <ResizablePanel defaultSize={20} className="relative hidden sm:block" order={1}>
          <TagSidebar sessionUser={session?.user as SessionUser} initNavItems={parsedTagData} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80} order={2}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40} order={3} >
              <StarList initNavItems={parsedTagData} StarContentComp={isMobile ? <WrapStarContent /> : <></>} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60} order={4} className="hidden sm:block">
              {isMobile ? <></> : <WrapStarContent />}
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}


function StartContentLoading() {
  return (
    <div className="p-4 flex flex-col gap-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
    </div>
  )
}
