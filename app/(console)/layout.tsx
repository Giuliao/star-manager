import { SidebarProvider } from "@/components/ui/sidebar";
import StoreProvider from '@/lib/store/store-provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </StoreProvider>
  )
}

