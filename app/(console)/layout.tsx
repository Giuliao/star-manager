import { SidebarProvider } from "@/components/ui/sidebar";
import { StarProvider } from "@/lib/context/star";
import StoreProvider from '@/lib/store/store-provider';
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SidebarProvider>
        <StarProvider>
          {children}
        </StarProvider>
      </SidebarProvider>
    </StoreProvider>
  )
}

