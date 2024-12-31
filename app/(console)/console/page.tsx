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
import type { SessionUser } from "@/types/user";

export default async function Console() {
  const cookieStore = await cookies();
  const owner = cookieStore.get("owner")?.value;
  const repo = cookieStore.get("repo")?.value;
  const session = await auth();

  return (
    <main className="flex-1 flex min-h-screen w-screen flex-col items-center justify-between">
      <DynamicPanel />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1">
        <ResizablePanel defaultSize={30} className="relative">
          <TagSidebar sessionUser={session?.user as SessionUser} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40}>
              <StarList />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
              <Suspense key={`${owner}-${repo}`} fallback={<div className="p-4">Loading...</div>}>
                <StarContent />
              </Suspense>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
