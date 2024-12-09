import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Card } from "@/components/ui/card";
import { DynamicPanel } from "@/components/dynamic-panel";
import { getStarList } from "@/lib/actions/github";
import { cn } from "@/lib/utils";

export default async function Home() {

  const starList = (await getStarList().catch(err => {
    console.log(err);
    return { data: [] };
  })).data;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <DynamicPanel />
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border flex-1">
        <ResizablePanel defaultSize={20}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Tags</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30}>
              <div className="flex items-center justify-start flex-col p-2 gap-3 h-[99vh] overflow-y-auto">

                {
                  starList.map((item: any, index: number) => {
                    return <Card className={cn("w-full h-32 p-2 hover:border-solid hover:border-l-sky-500 cursor-pointer")} key={index} >
                      {item.full_name}
                    </Card>
                  })
                }
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70}>
              <div className="grid grid-cols-4 h-full p-4 gap-4">
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
