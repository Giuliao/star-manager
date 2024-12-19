import { SidebarProvider } from "@/components/ui/sidebar";
import { StarProvider } from "@/lib/context/star";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <StarProvider>
        {children}
      </StarProvider>
    </SidebarProvider>
  )
}

