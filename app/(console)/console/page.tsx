import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { DynamicPanel } from "@/components/dynamic-panel";
import { AppSidebar } from "@/components/app-sidebar";
import { StarList } from "./_components/star-list";


export default async function Console() {

  return (
    <main className="flex-1 flex min-h-screen flex-col items-center justify-between">
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
              <div className="grid grid-cols-4 h-full p-4 gap-4">
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
