import { cookies } from "next/headers";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { DynamicPanel } from "@/components/dynamic-panel";
import { auth } from "@/auth";
import { listUserTagById } from "@/lib/actions/tag";
import { SessionUser } from "@/types/user";
import { parseTagData } from "@/lib/utils";
import dynamic from "next/dynamic";

const StarList = dynamic(async () => (await import("./_components/star-list")).StarList);
const TagSidebar = dynamic(async () => (await import("@/components/tag-sidebar")).TagSidebar);


export default async function Console({ content }: { content: React.ReactNode }) {
  const cookieStore = await cookies();
  const isMobile = cookieStore.get("isMobile")?.value === 'true';
  const session = await auth();
  const results = await listUserTagById((session?.user as SessionUser).dbId);
  const parsedTagData = parseTagData(results);

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
              <StarList initNavItems={parsedTagData} StarContentComp={isMobile ? content : <></>} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60} order={4} className="hidden sm:block">
              {isMobile ? <></> : content}
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
