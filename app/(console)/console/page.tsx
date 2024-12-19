import { Suspense } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { DynamicPanel } from "@/components/dynamic-panel";
import { AppSidebar } from "@/components/app-sidebar";
import { StarList } from "./_components/star-list";
import { StarContent } from "./_components/star-content";

export default async function Console() {

  return (
    <main className="flex-1 flex min-h-screen w-screen flex-col items-center justify-between">
      <DynamicPanel />
      <ResizablePanelGroup
        direction="horizontal"
        className="flex-1">
        <ResizablePanel defaultSize={30} className="relative">
          <AppSidebar />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={40}>
              <StarList />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
              <Suspense fallback={<div>Loading...</div>}>
                <StarContent />
              </Suspense>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
